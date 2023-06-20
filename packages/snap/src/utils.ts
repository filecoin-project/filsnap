/* eslint-disable no-console */
import type { SnapsGlobalObject } from '@metamask/snaps-types'
import * as Constants from './constants'
import * as Schemas from './schemas'
import type { Json, Network, SnapConfig, SnapResponseError } from './types'

/**
 * Get default configuration by network name
 *
 * @param networkName - Network name
 * @returns SnapConfig
 */
export function configFromNetwork(networkName?: Network): SnapConfig {
  switch (networkName) {
    case 'mainnet': {
      console.log('Filecoin mainnet network selected')
      return Constants.mainnetConfig
    }
    case 'testnet': {
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

/**
 * Extracts all JSON-serializable properties from an object.
 *
 * @param object - The object in question.
 * @returns An object containing all the JSON-serializable properties.
 */
function serializeObject(object: Record<PropertyKey, unknown>): Json {
  // eslint-disable-next-line unicorn/no-array-reduce
  return Object.getOwnPropertyNames(object).reduce<Record<string, Json>>(
    (acc, key) => {
      const value = object[key]
      const r = Schemas.json.safeParse(value)
      if (r.success) {
        acc[key] = r.data
      }

      return acc
    },
    {}
  )
}

/**
 * A type guard for Record<PropertyKey, unknown>.
 *
 * @param value - The value to check.
 * @returns Whether the specified value has a runtime type of `object` and is
 * neither `null` nor an `Array`.
 */
export function isObject(
  value: unknown
): value is Record<PropertyKey, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Serialize an error into a SnapError.
 * If the error is an object, it will be serialized into a JSON object.
 *
 * @param msg - Error message
 * @param data - Error data
 */
export function serializeError(msg: string, data?: unknown): SnapResponseError {
  const _data = isObject(data) ? serializeObject(data) : null
  // @ts-expect-error - no types
  const hasMessage = _data?.message != null && typeof _data.message === 'string'
  // @ts-expect-error - no types
  const _msg = (hasMessage ? _data.message : '') as string
  return {
    error: {
      message: msg + (hasMessage ? ` - ${_msg}` : ''),
      data: _data,
    },
  }
}
