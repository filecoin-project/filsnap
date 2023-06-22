import type { SnapConfig } from 'filsnap/src/types.ts'
import {
  hasMetaMask,
  isMetamaskSnapsSupported,
  isSnapInstalled,
} from './utils.ts'
import { MetamaskFilecoinSnap } from './snap.ts'

const defaultSnapOrigin = 'npm:filsnap'

export { MetamaskFilecoinSnap } from './snap.ts'
export {
  hasMetaMask,
  isMetamaskSnapsSupported,
  isSnapInstalled,
} from './utils.ts'

export type SnapInstallationParamNames = 'version' | string

/**
 * Install and enable Filecoin snap
 *
 * Checks for existence of Metamask and version compatibility with snaps before installation.
 *
 * Provided snap configuration must define at least network property so predefined configuration can be selected.
 * All other properties are optional, and if present will overwrite predefined property.
 *
 * @param config - SnapConfig
 * @param snapOrigin
 *
 * @param snapInstallationParams
 * @returns MetamaskFilecoinSnap - adapter object that exposes snap API
 */
export async function enableFilecoinSnap(
  config: Partial<SnapConfig>,
  snapOrigin?: string,
  snapInstallationParams: Record<SnapInstallationParamNames, unknown> = {}
): Promise<MetamaskFilecoinSnap> {
  const snapId = snapOrigin ?? defaultSnapOrigin

  // check all conditions
  if (!hasMetaMask()) {
    throw new Error('Metamask is not installed')
  }
  if (!(await isMetamaskSnapsSupported())) {
    throw new Error("Current Metamask version doesn't support snaps")
  }
  if (config?.network === null || config?.network === undefined) {
    throw new Error('Configuration must at least define network type')
  }

  const isInstalled = await isSnapInstalled(snapId)

  if (!isInstalled) {
    // // enable snap
    await window.ethereum.request({
      method: 'wallet_requestSnaps',
      params: {
        [snapId]: { ...snapInstallationParams },
      },
    })
  }

  // await unlockMetamask();

  // create snap describer
  const snap = new MetamaskFilecoinSnap(snapId)

  // set initial configuration
  const filecoinSnapApi = await snap.getFilecoinSnapApi()
  await filecoinSnapApi.configure(config)

  // return snap object
  return snap
}
