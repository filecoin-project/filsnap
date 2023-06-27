import type { SnapsGlobalObject } from '@metamask/snaps-types'
import type { RPC } from 'iso-filecoin/rpc'
import type { MessageObj } from 'iso-filecoin/types'
import type { z } from 'zod'
import type {
  literal,
  messageStatus,
  metamaskState,
  snapConfig,
} from './schemas'
import type { accountFromPrivateKey } from 'iso-filecoin/wallet'
import type { ConfigureRequest } from './rpc/configure'
import type {
  EstimateMessageGasRequest,
  MessageGasEstimate,
} from './rpc/estimateMessageGas'
import type { ExportPrivateKeyRequest } from './rpc/exportPrivateKey'
import type { GetMessagesRequest } from './rpc/getMessages'
import type { GetBalanceRequest } from './rpc/getBalance'
import type { SendMessageRequest } from './rpc/sendMessage'
import type {
  SignMessageRequest,
  SignMessageRawRequest,
  SignMessageResponse,
  SignMessageRawResponse,
} from './rpc/signMessage'

export type {
  EstimateMessageGasRequest,
  MessageGasEstimate,
} from './rpc/estimateMessageGas'
export type {
  SignMessageRequest,
  SignMessageResponse,
  SignMessageRawResponse,
} from './rpc/signMessage'
export type { MessageObj, Network } from 'iso-filecoin/types'

// Schema types
export type Literal = z.infer<typeof literal>
export type Json = Literal | { [key: string]: Json } | Json[]
export type SnapConfig = z.infer<typeof snapConfig>
export type MessageStatus = z.infer<typeof messageStatus>
export type MetamaskState = z.infer<typeof metamaskState>
export type Account = ReturnType<typeof accountFromPrivateKey>

// Filecoin types
export interface SignedMessage {
  message: MessageObj
  signature: {
    type: 'SECP256K1'
    data: string
  }
}

// Snap types
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
  result?: null
}

/**
 * Response from a snap request
 */
export type SnapResponse<R> =
  | {
      error?: null
      result: R
    }
  | SnapResponseError

export interface SnapContext {
  config: SnapConfig
  snap: SnapsGlobalObject
  rpc: RPC
  account: Account
}

export interface GetAddressRequest {
  method: 'fil_getAddress'
}

export interface GetPublicKeyRequest {
  method: 'fil_getPublicKey'
}

export type MetamaskFilecoinRpcRequest =
  | ConfigureRequest
  | ExportPrivateKeyRequest
  | GetPublicKeyRequest
  | GetAddressRequest
  | GetBalanceRequest
  | GetMessagesRequest
  | SignMessageRequest
  | SignMessageRawRequest
  | SendMessageRequest
  | EstimateMessageGasRequest

export interface FilecoinSnapApi {
  getPublicKey: () => Promise<string>
  getAddress: () => Promise<string>
  getBalance: () => Promise<string>
  exportPrivateKey: () => Promise<string>
  configure: (configuration: Partial<SnapConfig>) => Promise<void>
  signMessage: (
    message: SignMessageRequest['params']
  ) => Promise<SignMessageResponse>
  signMessageRaw: (message: string) => Promise<SignMessageRawResponse>
  sendMessage: (signedMessage: SignedMessage) => Promise<MessageStatus>
  getMessages: () => Promise<MessageStatus[]>
  calculateGasForMessage: (
    message: EstimateMessageGasRequest['params']['message'],
    maxFee?: string
  ) => Promise<MessageGasEstimate>
}
