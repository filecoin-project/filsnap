import type {
  OnSignatureResponse,
  OnTransactionResponse,
  Signature,
  SnapsProvider,
  Transaction,
} from '@metamask/snaps-sdk'
import type { IAddress, MessageObj } from 'iso-filecoin/types'
import type { accountFromPrivateKey } from 'iso-filecoin/wallet'
import type { Promisable } from 'type-fest'
import type { z } from 'zod'
import type {
  configure,
  filChangeNetwork,
  filDeriveAccount,
  filGetConfig,
  filSetConfig,
} from './rpc/configure'
import type { exportPrivateKey } from './rpc/export-private-key'
import type { getGasForMessage } from './rpc/gas-for-message'
import type { filGetAccount, getAccountInfo } from './rpc/get-account'
import type { getBalance } from './rpc/get-balance'
import type { sendMessage } from './rpc/send-message'
import type { filSign, signMessage, signMessageRaw } from './rpc/sign-message'
import type { config, literal, messageStatus, snapConfig } from './schemas'
import type { State } from './state'

export type { MessageObj, Network } from 'iso-filecoin/types'
export type { Snap, InterfaceContext } from '@metamask/snaps-sdk'

// Schema types
export type Literal = z.infer<typeof literal>
export type Json = Literal | { [key: string]: Json } | Json[]
export type SnapConfig = z.infer<typeof snapConfig>
export type Config = z.infer<typeof config>
export type MessageStatus = z.infer<typeof messageStatus>
export type Account = ReturnType<typeof accountFromPrivateKey>

// Snap types
export interface AccountSafe {
  address: IAddress
  pubKey: Uint8Array
  /**
   * Address index from the BIP44 derivation path
   */
  accountNumber: number
  /**
   * BIP44 derivation path
   */
  path: string
}

export interface AccountPrivate extends AccountSafe {
  privateKey: Uint8Array
}

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
  fil_getConfig: typeof filGetConfig
  fil_setConfig: typeof filSetConfig
  fil_deriveAccount: typeof filDeriveAccount
  fil_changeNetwork: typeof filChangeNetwork
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
  fil_getAccount: typeof filGetAccount
  fil_sign: typeof filSign
}

// UI Types
export interface HomepageContext extends Record<string, Json> {
  config: SnapConfig
  account: number
  address: string
  balance: string
  sendMessage: MessageObj | null
}

export interface TransactionInsightsProps {
  transaction: Transaction
  chainId: `${string}:${string}`
  transactionOrigin?: string
}

export type TransactionInsightsHandler = (
  props: TransactionInsightsProps,
  config: SnapConfig
) => Promisable<OnTransactionResponse | null>

export interface SignatureInsightsProps {
  signature: Signature
  signatureOrigin?: string
}

export type SignatureInsightsHandler = (
  props: SignatureInsightsProps,
  config?: SnapConfig
) => Promisable<OnSignatureResponse | null>
