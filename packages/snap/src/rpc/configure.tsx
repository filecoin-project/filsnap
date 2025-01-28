import { dequal } from 'dequal/lite'
import { RPC } from 'iso-filecoin/rpc'
import { parseDerivationPath } from 'iso-filecoin/utils'

// @ts-expect-error - no types for this package
import merge from 'merge-options'
import { getAccountSafe } from '../account'
import { Configure } from '../components/dialog-configure'
import { snapConfig } from '../schemas'
import type { SnapConfig, SnapContext, SnapResponse } from '../types'
import { configFromNetwork, serializeError } from '../utils'

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
 * Configures the snap with the provided configuration
 *
 * @param ctx - Snap context
 */
export async function getConfig(
  ctx: SnapContext
): Promise<SnapResponse<SnapConfig | null>> {
  const config = await ctx.state.get(ctx.origin)

  if (config) {
    return { result: config, error: null }
  }

  return { result: null, error: null }
}
