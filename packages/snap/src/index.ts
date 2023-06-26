import type { OnRpcRequestHandler } from '@metamask/snaps-types'
import { RPC } from 'iso-filecoin/rpc'
import { configure } from './rpc/configure'
import { estimateMessageGas, type EstimateParams } from './rpc/gas-for-message'
import { exportPrivateKey } from './rpc/export-private-key'
import { getBalance } from './rpc/get-balance'
import { getMessages } from './rpc/get-messages'
import { sendMessage } from './rpc/send-message'
import { signMessage, signMessageRaw } from './rpc/sign-message'
import type {
  SignMessageParams,
  SignMessageRawParams,
} from './rpc/sign-message'
import type { SnapConfig, SnapContext, SnapResponse } from './types'
import { configFromSnap, serializeError } from './utils'
import { getKeyPair } from './keypair'
import { hex } from 'iso-base/rfc4648'

export type * from './rpc/configure'
export type * from './rpc/gas-for-message'
export type * from './rpc/export-private-key'
export type * from './rpc/get-balance'
export type * from './rpc/get-messages'
export type * from './rpc/send-message'
export type * from './rpc/sign-message'

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
