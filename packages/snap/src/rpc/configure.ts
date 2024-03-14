// @ts-expect-error - no types for this package
import merge from 'merge-options'
import { row, panel, text } from '@metamask/snaps-sdk'
import { RPC } from 'iso-filecoin/rpc'
import { parseDerivationPath } from 'iso-filecoin/utils'
import { snapConfig } from '../schemas'
import { configFromNetwork, serializeError, snapDialog } from '../utils'
import type { SnapConfig, SnapContext, SnapResponse } from '../types'
import { getAccountSafe } from '../account'

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

  const account = await getAccountSafe(snap, _params.data)

  const conf = await snapDialog(ctx.snap, {
    type: 'confirmation',
    content: panel([
      text(
        `Do you want to connect **Account ${accountNumber}** _${account.address.toString()}_ to **${
          ctx.origin
        }**?`
      ),
      row('Derivation Path:', text(derivationPath)),
      row('API:', text(url)),
      row('Network:', text(network)),
      row('Unit Decimals:', text(unit?.decimals.toString() ?? 'N/A')),
      row('Unit Symbol:', text(unit?.symbol ?? 'N/A')),    ]),
  })

  if (conf) {
    await ctx.state.set(ctx.origin, _params.data)
    return { result: _params.data, error: null }
  }
  return serializeError('User denied configuration')
}
