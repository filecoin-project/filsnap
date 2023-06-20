import type { MessageSchema } from './message.js'
import type { z } from 'zod'

export interface RpcError {
  error: {
    code: number
    message: string
  }
  result?: undefined
}

export type MessageObj = z.infer<typeof MessageSchema>
export interface LotusMessage {
  Version: 0
  To: string
  From: string
  Nonce: number
  Value: string
  GasLimit: number
  GasFeeCap: string
  GasPremium: string
  Method: number
  Params: string | null
  CID: {
    '/': string
  }
}

export interface LotusSignature {
  Type: number
  Data: string
}

export type Network = 'mainnet' | 'testnet'

export interface Options {
  token?: string
  api: string | URL
  network?: Network
  fetch?: typeof globalThis.fetch
}

/**
 * Lotus API responses
 */
export type VersionResponse =
  | {
      result: { Version: string; APIVersion: number; BlockDelay: number }
      error: undefined
    }
  | RpcError

export type StateNetworkNameResponse =
  | {
      result: Network
      error: undefined
    }
  | RpcError

export type MpoolGetNonceResponse =
  | {
      result: number
      error: undefined
    }
  | RpcError

export type GasEstimateMessageGasResponse =
  | {
      result: LotusMessage
      error: undefined
    }
  | RpcError

export type WalletBalanceResponse =
  | {
      /**
       * Wallet balance in attoFIL
       *
       * @example '99999927137190925849'
       */
      result: string
      error: undefined
    }
  | RpcError

export type MpoolPushResponse =
  | {
      result: {
        ['/']: string
      }
    }
  | RpcError
