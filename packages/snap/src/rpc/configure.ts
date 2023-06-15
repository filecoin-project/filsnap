import { type SnapsGlobalObject } from '@metamask/snaps-types'
import { getApiFromConfig } from '../filecoin/api'
import { type LotusRpcApi } from '../filecoin/types'
import { type SnapConfig } from '../types'
import merge from 'merge-options'
import type { MetamaskState } from '../schemas'
import { configFromNetwork } from '../utils'

export interface ConfigureResponse {
  api: LotusRpcApi
  snapConfig: SnapConfig
}

/**
 * Configures the snap with the provided configuration
 *
 * @param snap - Snaps global object
 * @param networkName - name of the network to configure
 * @param overrides - overrides for the default configuration
 */
export async function configure(
  snap: SnapsGlobalObject,
  networkName: string,
  overrides: Partial<SnapConfig> = {}
): Promise<ConfigureResponse> {
  const configuration = merge(
    configFromNetwork(networkName),
    overrides
  ) as SnapConfig
  const coinType = configuration.derivationPath.split('/')[2]
  const bip44Code = coinType.replace("'", '')
  // instatiate new api
  const api = getApiFromConfig(configuration)
  const apiNetworkName = await api.stateNetworkName()
  // check if derivation path is valid
  if (configuration.network === 'f' && apiNetworkName === 'mainnet') {
    // if on mainet, coin type needs to be 461
    if (bip44Code !== '461') {
      throw new Error('Wrong CoinType in derivation path')
    }
  } else if (configuration.network === 't' && apiNetworkName !== 'mainnet') {
    if (bip44Code !== '1') {
      throw new Error('Wrong CoinType in derivation path')
    }
  } else {
    throw new Error(
      'Mismatch between configured network and network provided by RPC'
    )
  }
  const state = (await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  })) as unknown as MetamaskState
  state.filecoin.config = configuration

  await snap.request({
    method: 'snap_manageState',
    params: { newState: state, operation: 'update' },
  })
  return { api, snapConfig: configuration }
}
