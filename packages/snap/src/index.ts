import type { OnRpcRequestHandler } from '@metamask/snaps-types'
import { RPC } from 'iso-filecoin/rpc'
import { configure } from './rpc/configure'
import {
  estimateMessageGas,
  type EstimateParams,
} from './rpc/estimateMessageGas'
import { exportPrivateKey } from './rpc/exportPrivateKey'
import { getBalance } from './rpc/getBalance'
import { getMessages } from './rpc/getMessages'
import { sendMessage } from './rpc/sendMessage'
import { signMessage, signMessageRaw } from './rpc/signMessage'
import type { SignMessageParams, SignMessageRawParams } from './rpc/signMessage'
import type { SnapConfig, SnapContext, SnapResponse } from './types'
import { configFromSnap, serializeError } from './utils'
import { getKeyPair } from './filecoin/account'
import { hex } from 'iso-base/rfc4648'

export type * from './rpc/configure'
export type * from './rpc/estimateMessageGas'
export type * from './rpc/exportPrivateKey'
export type * from './rpc/getBalance'
export type * from './rpc/getMessages'
export type * from './rpc/sendMessage'
export type * from './rpc/signMessage'

export type GetAddressResponse = SnapResponse<string>
export type GetPublicResponse = SnapResponse<string>

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  try {
    const config = await configFromSnap(snap)
    const rpc = new RPC({
      api: config.rpc.url,
      network: config.network,
    })
    const account = await getKeyPair(snap)

    const context: SnapContext = {
      config,
      rpc,
      account,
      snap,
    }

    switch (request.method) {
      case 'fil_configure': {
        return await configure(snap, request.params as Partial<SnapConfig>)
      }
      case 'fil_getAddress': {
        return { result: account.address.toString() }
      }
      case 'fil_getPublicKey': {
        return { result: hex.encode(account.pubKey) }
      }
      case 'fil_exportPrivateKey': {
        return await exportPrivateKey(context)
      }
      case 'fil_getBalance': {
        return await getBalance(context)
      }
      case 'fil_getMessages': {
        return await getMessages(context)
      }
      case 'fil_signMessage': {
        return await signMessage(context, request.params as SignMessageParams)
      }
      case 'fil_signMessageRaw': {
        return await signMessageRaw(
          context,
          request.params as SignMessageRawParams
        )
      }
      case 'fil_sendMessage': {
        return await sendMessage(context, request.params as any)
      }
      case 'fil_getGasForMessage': {
        return await estimateMessageGas(
          context,
          request.params as EstimateParams
        )
      }
      default: {
        return serializeError(
          `Unsupported RPC method: "${request.method}" failed`
        )
      }
    }
  } catch (error) {
    const err = error as Error

    return serializeError(`RPC method "${request.method}" failed`, err)
  }
}
