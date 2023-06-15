/* eslint-disable no-console */
import { type SnapsGlobalObject } from '@metamask/snaps-types'
import { type SnapConfig } from './types'
import * as Constants from './constants'
import * as Schemas from './schemas'

/**
 * Get default configuration by network name
 *
 * @param networkName - Network name
 * @returns SnapConfig
 */
export function configFromNetwork(networkName?: string): SnapConfig {
  switch (networkName) {
    case 'f': {
      console.log('Filecoin mainnet network selected')
      return Constants.mainnetConfig
    }
    case 't': {
      console.log('Filecoin testnet network selected')
      return Constants.testnetConfig
    }
    default: {
      return Constants.mainnetConfig
    }
  }
}

/**
 * Get configuration from snap
 * If configuration is not present in state, it will be initialized with default values
 *
 * @param snap - Snaps global object
 */
export async function configFromSnap(
  snap: SnapsGlobalObject
): Promise<SnapConfig> {
  const state = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  })

  const result = Schemas.metamaskState.safeParse(state)

  if (result.success) {
    return result.data.filecoin.config
  } else {
    await snap.request({
      method: 'snap_manageState',
      params: { newState: Constants.initialState, operation: 'update' },
    })

    return Constants.initialState.filecoin.config
  }
}

export const BIP_32_PATH_REGEX = /^\d+'?$/u

interface DerivationPathComponents {
  purpose: number
  coinType: number
  account: number
  change: number
  addressIndex: number
}

/**
 * Parse a derivation path into its components
 *
 * @see https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki#path-levels
 * @param path - The derivation path to parse
 * @returns An object containing the derivation path components
 */
export function parseDerivationPath(path: string): DerivationPathComponents {
  const parts = path.split('/')
  if (parts.length !== 6) {
    throw new Error(
      "Invalid derivation path: depth must be 5 \"m / purpose' / coin_type' / account' / change / address_index\""
    )
  }

  if (parts[0] !== 'm') {
    throw new Error('Invalid derivation path: depth 0 must be "m"')
  }

  if (parts[1] !== "44'") {
    throw new Error(
      'Invalid derivation path: The "purpose" node (depth 1) must be the string "44\'"'
    )
  }

  if (!BIP_32_PATH_REGEX.test(parts[2]) || !parts[2].endsWith("'")) {
    throw new Error(
      'Invalid derivation path: The "coin_type" node (depth 2) must be a hardened BIP-32 node.'
    )
  }

  if (!BIP_32_PATH_REGEX.test(parts[3]) || !parts[3].endsWith("'")) {
    throw new Error(
      'Invalid derivation path: The "account" node (depth 3) must be a hardened BIP-32 node.'
    )
  }

  if (!BIP_32_PATH_REGEX.test(parts[4])) {
    throw new Error(
      'Invalid derivation path: The "change" node (depth 4) must be a BIP-32 node.'
    )
  }

  if (!BIP_32_PATH_REGEX.test(parts[5])) {
    throw new Error(
      'Invalid derivation path: The "address_index" node (depth 5) must be a BIP-32 node.'
    )
  }

  const purpose = Number.parseInt(parts[1], 10)
  const coinType = Number.parseInt(parts[2], 10)
  const account = Number.parseInt(parts[3], 10)
  const change = Number.parseInt(parts[4], 10)
  const addressIndex = Number.parseInt(parts[5], 10)
  if (
    Number.isNaN(purpose) ||
    Number.isNaN(coinType) ||
    Number.isNaN(account) ||
    Number.isNaN(change) ||
    Number.isNaN(addressIndex)
  ) {
    throw new TypeError(
      'Invalid derivation path: some of the components cannot be parsed as numbers'
    )
  }

  return { purpose, coinType, account, change, addressIndex }
}
