import type { OnRpcRequestHandler } from '@metamask/snaps-types'
import { configure } from './rpc/configure'
import { exportPrivateKey } from './rpc/export-private-key'
import { getGasForMessage, type EstimateParams } from './rpc/gas-for-message'
import { getBalance } from './rpc/get-balance'
import { sendMessage } from './rpc/send-message'

import { hex } from 'iso-base/rfc4648'
import { getAccountSafe } from './account'
import { getAccountInfo } from './rpc/get-account'
import type {
  SignMessageParams,
  SignMessageRawParams,
} from './rpc/sign-message'
import { signMessage, signMessageRaw } from './rpc/sign-message'
import { State } from './state'
import type { SnapConfig, SnapContext } from './types'
import { serializeError } from './utils'

export type {
  AccountInfo,
  FilSnapMethods,
  Network,
  RequestWithFilSnap,
  SnapConfig,
} from './types'

export { onTransaction } from './transaction-insight'

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  try {
    const state = new State(snap)
    const context: SnapContext = {
      snap,
      origin,
      state,
    }

    switch (request.method) {
      case 'fil_configure': {
        return await configure(context, request.params as Partial<SnapConfig>)
      }
      case 'fil_getAccountInfo': {
        return await getAccountInfo(context)
      }
      case 'fil_getAddress': {
        const config = await state.get(origin)

        if (config == null) {
          return serializeError(
            `No configuration found for ${origin}. Connect to Filsnap first.`
          )
        }

        const account = await getAccountSafe(snap, config)
        return { result: account.address.toString() }
      }
      case 'fil_getPublicKey': {
        const config = await state.get(origin)

        if (config == null) {
          return serializeError(
            `No configuration found for ${origin}. Connect to Filsnap first.`
          )
        }

        const account = await getAccountSafe(snap, config)
        return { result: hex.encode(account.pubKey) }
      }
      case 'fil_exportPrivateKey': {
        return await exportPrivateKey(context)
      }
      case 'fil_getBalance': {
        return await getBalance(context)
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
        return await getGasForMessage(context, request.params as EstimateParams)
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
