import { type SnapsGlobalObject } from '@metamask/snaps-types'
import merge from 'merge-options'
import { snapConfig } from '../schemas'
import {
  configFromNetwork,
  parseDerivationPath,
  serializeError,
} from '../utils'
import { RPC } from 'iso-rpc'
import type { MetamaskState, SnapConfig, SnapResponse } from '../types'

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
 * @param snap - Snaps global object
 * @param params - overrides for the default configuration
 */
export async function configure(
  snap: SnapsGlobalObject,
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
    rpc: { url },
    network,
  } = _params.data

  const { coinType } = parseDerivationPath(derivationPath)
  const rpc = new RPC({
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
  const state = (await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  })) as unknown as MetamaskState
  state.filecoin.config = _params.data

  await snap.request({
    method: 'snap_manageState',
    params: { newState: state, operation: 'update' },
  })
  return { result: _params.data }
}
