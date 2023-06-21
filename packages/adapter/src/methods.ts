import type {
  MessageStatus,
  MetamaskFilecoinRpcRequest,
  SignedMessage,
  SignMessageRequest,
  SignMessageResponse,
  SignMessageRawResponse,
  SnapConfig,
  MessageGasEstimate,
} from '../../snap/src/types.ts'

import type { MetamaskFilecoinSnap } from './snap.ts'

/**
 *
 * @param request
 * @param snapId
 */
async function sendSnapMethod<T>(
  request: MetamaskFilecoinRpcRequest,
  snapId: string
): Promise<T> {
  return window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      request,
      snapId,
    },
  })
}

/**
 *
 */
export async function getAddress(this: MetamaskFilecoinSnap): Promise<string> {
  return await sendSnapMethod({ method: 'fil_getAddress' }, this.snapId)
}

/**
 *
 */
export async function getPublicKey(
  this: MetamaskFilecoinSnap
): Promise<string> {
  return await sendSnapMethod({ method: 'fil_getPublicKey' }, this.snapId)
}

/**
 *
 */
export async function getBalance(this: MetamaskFilecoinSnap): Promise<string> {
  return await sendSnapMethod({ method: 'fil_getBalance' }, this.snapId)
}

/**
 *
 */
export async function exportPrivateKey(
  this: MetamaskFilecoinSnap
): Promise<string> {
  return await sendSnapMethod({ method: 'fil_exportPrivateKey' }, this.snapId)
}

/**
 *
 * @param configuration
 */
export async function configure(
  this: MetamaskFilecoinSnap,
  configuration: SnapConfig
): Promise<void> {
  await sendSnapMethod(
    { method: 'fil_configure', params: { configuration } },
    this.snapId
  )
}

/**
 *
 * @param message
 */
export async function signMessage(
  this: MetamaskFilecoinSnap,
  message: SignMessageRequest
): Promise<SignMessageResponse> {
  return await sendSnapMethod(
    { method: 'fil_signMessage', params: { message } },
    this.snapId
  )
}

/**
 *
 * @param rawMessage
 */
export async function signMessageRaw(
  this: MetamaskFilecoinSnap,
  rawMessage: string
): Promise<SignMessageRawResponse> {
  return await sendSnapMethod(
    { method: 'fil_signMessageRaw', params: { message: rawMessage } },
    this.snapId
  )
}

/**
 *
 * @param signedMessage
 */
export async function sendMessage(
  this: MetamaskFilecoinSnap,
  signedMessage: SignedMessage
): Promise<MessageStatus> {
  return await sendSnapMethod(
    { method: 'fil_sendMessage', params: { signedMessage } },
    this.snapId
  )
}

/**
 *
 */
export async function getMessages(
  this: MetamaskFilecoinSnap
): Promise<MessageStatus[]> {
  return await sendSnapMethod({ method: 'fil_getMessages' }, this.snapId)
}

/**
 *
 * @param message
 * @param maxFee
 */
export async function calculateGasForMessage(
  this: MetamaskFilecoinSnap,
  message: SignMessageRequest,
  maxFee?: string
): Promise<MessageGasEstimate> {
  return await sendSnapMethod(
    {
      method: 'fil_getGasForMessage',
      params: { maxFee, message },
    },
    this.snapId
  )
}
