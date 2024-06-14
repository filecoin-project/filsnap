import {
  address,
  copyable,
  heading,
  panel,
  row,
  text,
} from '@metamask/snaps-sdk'
import { dequal } from 'dequal/lite'
import { RPC } from 'iso-filecoin/rpc'
import { parseDerivationPath } from 'iso-filecoin/utils'

// @ts-expect-error - no types for this package
import merge from 'merge-options'
import { getAccountSafe } from '../account'
import { snapConfig } from '../schemas'
import type { SnapConfig, SnapContext, SnapResponse } from '../types'
import { configFromNetwork, serializeError, snapDialog } from '../utils'

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
    unit,
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

  const conf = await snapDialog(ctx.snap, {
    type: 'confirmation',
    content: panel([
      heading('Connection request'),
      text(`**${ctx.origin}** wants to connect with your Filecoin account.`),
      text(`Account ${accountNumber}`),
      copyable(`${account.address.toString()}`),
      row('Derivation Path:', text(derivationPath)),
      row('API:', text(url)),
      row('Network:', text(network)),
      row('Unit Decimals:', text(unit?.decimals.toString() ?? 'N/A')),
      row('Unit Symbol:', text(unit?.symbol ?? 'N/A')),
      // text('Derivation Path:'),
      // copyable(derivationPath),
      // text('API:'),
      // copyable(url),
      // text('Network:'),
      // copyable(network),
      // text('Unit Decimals:'),
      // copyable(unit?.decimals.toString() ?? 'N/A'),
      // text('Unit Symbol:'),
      // copyable(unit?.symbol ?? 'N/A'),
    ]),
  })

  if (conf) {
    await ctx.state.set(ctx.origin, _params.data)
    return { result: _params.data, error: null }
  }
  return serializeError('User denied configuration')
}
