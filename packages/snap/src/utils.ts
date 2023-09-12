/* eslint-disable no-console */
import type { SnapsGlobalObject } from '@metamask/snaps-types'
import type { NodeType, Panel } from '@metamask/snaps-ui'
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
      return Constants.mainnetConfig
    }
    case 'testnet': {
      return Constants.testnetConfig
    }
    default: {
      return Constants.mainnetConfig
    }
  }
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
    result: null,
    error: {
      message: msg + (hasMessage ? ` - ${_msg}` : ''),
      data: _data,
    },
  }
}

type DialogContent =
  | {
      type: 'alert'
      content:
        | Panel
        | {
            value: string
            type: NodeType.Copyable
          }
        | {
            type: NodeType.Divider
          }
        | {
            value: string
            type: NodeType.Heading
          }
        | {
            type: NodeType.Spinner
          }
        | {
            value: string
            type: NodeType.Text
          }
    }
  | {
      type: 'confirmation'
      content:
        | Panel
        | {
            value: string
            type: NodeType.Copyable
          }
        | {
            type: NodeType.Divider
          }
        | {
            value: string
            type: NodeType.Heading
          }
        | {
            type: NodeType.Spinner
          }
        | {
            value: string
            type: NodeType.Text
          }
    }
  | {
      type: 'prompt'
      content:
        | Panel
        | {
            value: string
            type: NodeType.Copyable
          }
        | {
            type: NodeType.Divider
          }
        | {
            value: string
            type: NodeType.Heading
          }
        | {
            type: NodeType.Spinner
          }
        | {
            value: string
            type: NodeType.Text
          }
      placeholder?: string | undefined
    }

/**
 * Show a dialog to the user
 *
 * @param snap - The snap itself
 * @param params - The dialog content
 * @see https://docs.metamask.io/snaps/reference/rpc-api/#snap_dialog
 */
export async function snapDialog(
  snap: SnapsGlobalObject,
  params: DialogContent
): Promise<boolean> {
  const result = await snap.request({
    method: 'snap_dialog',
    params,
  })

  return result === true
}
