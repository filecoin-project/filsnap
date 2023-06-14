import type { OnRpcRequestHandler } from '@metamask/snaps-types'
import { getApiFromConfig } from './filecoin/api.js'
import { configure } from './rpc/configure.js'
import { estimateMessageGas } from './rpc/estimateMessageGas.js'
import { exportPrivateKey } from './rpc/exportPrivateKey.js'
import { getAddress } from './rpc/getAddress.js'
import { getBalance } from './rpc/getBalance.js'
import { getMessages } from './rpc/getMessages.js'
import { getPublicKey } from './rpc/getPublicKey.js'
import { sendMessage } from './rpc/sendMessage.js'
import { signMessage, signMessageRaw } from './rpc/signMessage.js'
import {
  isValidConfigureRequest,
  isValidEstimateGasRequest,
  isValidSendRequest,
  isValidSignRequest,
} from './util/params.js'
import { configFromSnap } from './utils.js'

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  const config = await configFromSnap(snap)

  switch (request.method) {
    case 'fil_configure': {
      isValidConfigureRequest(request.params)
      const resp = await configure(
        snap,
        request.params.configuration.network,
        request.params.configuration
      )
      return resp.snapConfig
    }
    case 'fil_getAddress': {
      return await getAddress(snap)
    }
    case 'fil_getPublicKey': {
      return await getPublicKey(snap)
    }
    case 'fil_exportPrivateKey': {
      return await exportPrivateKey(snap)
    }
    case 'fil_getBalance': {
      const balance = await getBalance(snap, getApiFromConfig(config))
      return balance
    }
    case 'fil_getMessages': {
      return await getMessages(snap)
    }
    case 'fil_signMessage': {
      isValidSignRequest(request.params)
      return await signMessage(
        snap,
        getApiFromConfig(config),
        request.params.message
      )
    }
    case 'fil_signMessageRaw': {
      if (
        'message' in request.params &&
        typeof request.params.message === 'string'
      ) {
        return await signMessageRaw(snap, request.params.message)
      } else {
        throw new Error('Invalid raw message signing request')
      }
    }
    case 'fil_sendMessage': {
      isValidSendRequest(request.params)
      return await sendMessage(
        snap,
        getApiFromConfig(config),
        request.params.signedMessage
      )
    }
    case 'fil_getGasForMessage': {
      isValidEstimateGasRequest(request.params)
      return await estimateMessageGas(
        snap,
        getApiFromConfig(config),
        request.params.message,
        request.params.maxFee
      )
    }
    default: {
      throw new Error('Unsupported RPC method')
    }
  }
}
