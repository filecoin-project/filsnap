import type { z } from 'zod'
import type {
  literal,
  messageStatus,
  metamaskState,
  network,
  snapConfig,
} from './schemas'
import type { MessageSchema, RPC } from 'iso-rpc'
import type { SnapsGlobalObject } from '@metamask/snaps-types'

// Schema types
export type Literal = z.infer<typeof literal>
export type Json = Literal | { [key: string]: Json } | Json[]
export type Message = z.infer<typeof MessageSchema>
export type Network = z.infer<typeof network>
export type SnapConfig = z.infer<typeof snapConfig>
export type MessageStatus = z.infer<typeof messageStatus>
export type MetamaskState = z.infer<typeof metamaskState>

// Filecoin types
export interface SignedMessage {
  message: Message
  signature: MessageSignature
}

export interface MessageSignature {
  data: string
  type: number
}

export interface KeyPair {
  address: string
  privateKey: string
  publicKey: string
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
  keypair: KeyPair
}
