import type { SnapsProvider } from '@metamask/snaps-sdk'
import type { accountFromPrivateKey } from 'iso-filecoin/wallet'
import type { z } from 'zod'
import type { configure } from './rpc/configure'
import type { exportPrivateKey } from './rpc/export-private-key'
import type { getGasForMessage } from './rpc/gas-for-message'
import type { getAccountInfo } from './rpc/get-account'
import type { getBalance } from './rpc/get-balance'
import type { sendMessage } from './rpc/send-message'
import type { signMessage, signMessageRaw } from './rpc/sign-message'
import type { literal, messageStatus, snapConfig } from './schemas'
import type { State } from './state'

export type { MessageObj, Network } from 'iso-filecoin/types'

// Schema types
export type Literal = z.infer<typeof literal>
export type Json = Literal | { [key: string]: Json } | Json[]
export type SnapConfig = z.infer<typeof snapConfig>
export type MessageStatus = z.infer<typeof messageStatus>
export type Account = ReturnType<typeof accountFromPrivateKey>

// Snap types
export interface AccountInfo {
  address: string
  pubKey: string
  balance: string
  config: SnapConfig
}

export type SnapErrorData =
  | Json
  | {
      [key: string]: unknown
      cause: unknown
    }

/**
 * Error returned from a snap request
 */
export interface SnapError {
  message: string
  data?: SnapErrorData
}

export interface SnapResponseError {
  error: SnapError
  result: null
}

/**
 * Response from a snap request
 */
export type SnapResponse<R> =
  | {
      error: null
      result: R
    }
  | SnapResponseError

export interface SnapContext {
  // config: SnapConfig
  snap: SnapsProvider
  // rpc: RPC
  // account: Account
  origin: string
  state: State
}

// Extra resquest types
export type GetAddressResponse = SnapResponse<string>
export type GetPublicResponse = SnapResponse<string>

/**
 * The 'wallet_invokeSnap' RPC request handlers
 *
 * Should always return a promise as this is on the metamask side
 */
export interface FilSnapMethods {
  fil_configure: typeof configure
  fil_getAddress: (snap: SnapsProvider) => Promise<GetAddressResponse>
  fil_getPublicKey: (snap: SnapsProvider) => Promise<GetPublicResponse>
  fil_getBalance: typeof getBalance
  fil_exportPrivateKey: typeof exportPrivateKey
  fil_getGasForMessage: typeof getGasForMessage
  fil_signMessage: typeof signMessage
  fil_signMessageRaw: typeof signMessageRaw
  fil_sendMessage: typeof sendMessage
  fil_getAccountInfo: typeof getAccountInfo
}

export type RequestWithFilSnap = <
  T,
  Method,
  SnapMethod extends keyof FilSnapMethods,
>(
  args: Method extends 'wallet_invokeSnap'
    ? {
        method: Method
        params: {
          request: Parameters<FilSnapMethods[SnapMethod]>[1] extends undefined
            ? {
                method: SnapMethod
              }
            : {
                method: SnapMethod
                params: Parameters<FilSnapMethods[SnapMethod]>[1]
              }
          snapId: string
        }
      }
    : {
        /** The RPC method to request. */
        method: string
        /** The params of the RPC method, if any. */
        params?: unknown[] | Record<string, unknown>
      }
) => SnapMethod extends keyof FilSnapMethods
  ? ReturnType<FilSnapMethods[SnapMethod]>
  : Promise<T>
