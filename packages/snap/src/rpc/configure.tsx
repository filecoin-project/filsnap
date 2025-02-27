import { dequal } from 'dequal/lite'
import { RPC } from 'iso-filecoin/rpc'
import { parseDerivationPath } from 'iso-filecoin/utils'

// @ts-expect-error - no types for this package
import merge from 'merge-options'
import type { Jsonify } from 'type-fest'
import { getAccountSafe } from '../account'
import { Configure } from '../components/dialog-configure'
import { config, snapConfig } from '../schemas'
import type { Config, SnapConfig, SnapContext, SnapResponse } from '../types'
import {
  configFromNetwork,
  configToSnapConfig,
  serializeError,
  serializeValidationError,
  snapConfigToConfig,
} from '../utils'
import { type IAccountSerialized, filGetAccount } from './get-account'

// Types
export type ConfigureParams = Partial<SnapConfig>
export interface ConfigureRequest {
  method: 'fil_configure'
  params: ConfigureParams
}
export type ConfigureResponse = SnapResponse<SnapConfig>

/**
 * Configures the snap with the provided configuration
 *
 * @param ctx - Snap context
 * @param params - overrides for the default configuration
 */
export async function configure(
  ctx: SnapContext,
  params: ConfigureParams
): Promise<ConfigureResponse> {
  const _params = snapConfig.safeParse(
    merge(configFromNetwork(params.network), params)
  )
  if (!_params.success) {
    return serializeError(
      `Invalid params ${_params.error.message}`,
      _params.error
    )
  }

  const {
    derivationPath,
    rpc: { url, token },
    network,
  } = _params.data

  const { coinType, account: accountNumber } =
    parseDerivationPath(derivationPath)
  const rpc = new RPC({
    token,
    api: url,
    network,
  })
  const { error, result: rpcNetwork } = await rpc.networkName()
  if (error != null) {
    return serializeError('RPC call to "StateNetworkName" failed', error)
  }

  if (network === 'mainnet' && rpcNetwork === 'mainnet' && coinType !== 461) {
    return serializeError(
      `For mainnet, CoinType must be 461 but got ${coinType}`
    )
  }

  if (network === 'testnet' && rpcNetwork !== 'mainnet' && coinType !== 1) {
    return serializeError(`For testnet, CoinType must be 1 but got ${coinType}`)
  }

  if (network !== 'mainnet' && rpcNetwork === 'mainnet') {
    return serializeError(
      'Mismatch between configured network and network provided by RPC'
    )
  }

  const config = await ctx.state.get(ctx.origin)

  if (config && dequal(config, _params.data)) {
    return { result: _params.data, error: null }
  }

  const account = await getAccountSafe(snap, _params.data)

  const conf = await ctx.snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: (
        <Configure
          accountNumber={accountNumber}
          address={account.address.toString()}
          config={_params.data}
          origin={ctx.origin}
        />
      ),
    },
  })

  if (conf) {
    await ctx.state.set(ctx.origin, _params.data)
    return { result: _params.data, error: null }
  }
  return serializeError('User denied configuration')
}

/**
 * RPC method to get the current configuration
 *
 * @param ctx - Snap context
 */
export async function filGetConfig(
  ctx: SnapContext
): Promise<SnapResponse<SnapConfig | null>> {
  const config = await ctx.state.get(ctx.origin)

  if (config) {
    return { result: config, error: null }
  }

  return { result: null, error: null }
}

/**
 * RPC method to set the configuration
 */
export async function filSetConfig(
  ctx: SnapContext,
  params?: Partial<Config>
): Promise<
  SnapResponse<{
    config: SnapConfig
    account: Jsonify<IAccountSerialized>
  }>
> {
  // Make sure rpcUrl is set if network is provided
  if (params?.network && params.rpcUrl == null) {
    params.rpcUrl = configFromNetwork(params?.network).rpc.url
  }
  const internalState = await ctx.state.get(ctx.origin)
  const defaultState = internalState ?? configFromNetwork()

  // Merge everything together
  const newConfig = config.safeParse(
    merge(snapConfigToConfig(defaultState), params)
  )
  if (!newConfig.success) {
    return serializeValidationError(newConfig.error)
  }

  const newSnapConfig = configToSnapConfig(newConfig.data)

  // Confirm rpc url matches network
  if (params?.rpcUrl || newSnapConfig.network !== defaultState.network) {
    const rpc = new RPC({
      token: newSnapConfig.rpc.token,
      api: newSnapConfig.rpc.url,
      network: newSnapConfig.network,
    })
    const networkName = await rpc.networkName()
    if (networkName.error) {
      return serializeError(
        'RPC call to "StateNetworkName" failed',
        networkName.error
      )
    }
    const networkFromRpc =
      networkName.result === 'mainnet' ? 'mainnet' : 'testnet'

    if (newSnapConfig.network !== networkFromRpc) {
      return serializeError(
        'Mismatch between configured network and network provided by RPC'
      )
    }
  }

  // If the state is already set, don't update it and avoid prompting
  if (internalState && dequal(internalState, newSnapConfig)) {
    const account = await filGetAccount(ctx)
    if (account.error) {
      return account
    }
    return {
      result: {
        account: account.result,
        config: internalState,
      },
      error: null,
    }
  }

  // Show prompt to confirm new config
  const account = await getAccountSafe(snap, newSnapConfig)
  const conf = await ctx.snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: (
        <Configure
          accountNumber={account.accountNumber}
          address={account.address.toString()}
          config={newSnapConfig}
          origin={ctx.origin}
        />
      ),
    },
  })

  if (conf) {
    await ctx.state.set(ctx.origin, newSnapConfig)
    const account = await filGetAccount(ctx)
    if (account.error) {
      return account
    }
    return {
      result: {
        account: account.result,
        config: newSnapConfig,
      },
      error: null,
    }
  }
  return serializeError('User denied configuration')
}
