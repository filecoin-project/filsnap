import type {
  EstimateMessageGasRequest,
  MessageStatus,
  MetamaskFilecoinRpcRequest,
  SignedMessage,
  SignMessageRequest,
  SignMessageResponse,
  SignMessageRawResponse,
  SnapConfig,
  MessageGasEstimate,
} from 'filsnap/src/types'

import type { MetamaskFilecoinSnap } from './snap'

/**
 * Invoke a snap method
 *
 * @param request
 * @param snapId
 * @returns snapMethodResponse
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
 * Get the account's address
 *
 * @returns address
 */
export async function getAddress(this: MetamaskFilecoinSnap): Promise<string> {
  return await sendSnapMethod({ method: 'fil_getAddress' }, this.snapId)
}

/**
 * Get the account's public key
 *
 * @returns publicKey
 */
export async function getPublicKey(
  this: MetamaskFilecoinSnap
): Promise<string> {
  return await sendSnapMethod({ method: 'fil_getPublicKey' }, this.snapId)
}

/**
 * Get the account's balance
 *
 * @returns balance
 */
export async function getBalance(this: MetamaskFilecoinSnap): Promise<string> {
  return await sendSnapMethod({ method: 'fil_getBalance' }, this.snapId)
}

/**
 * Export the account's private key
 *
 * @returns privateKey
 */
export async function exportPrivateKey(
  this: MetamaskFilecoinSnap
): Promise<string> {
  return await sendSnapMethod({ method: 'fil_exportPrivateKey' }, this.snapId)
}

/**
 *
 * @param configuration
 * @returns void
 */
export async function configure(
  this: MetamaskFilecoinSnap,
  configuration: Partial<SnapConfig>
): Promise<void> {
  await sendSnapMethod(
    { method: 'fil_configure', params: { ...configuration } },
    this.snapId
  )
}

/**
 * Sign a message
 *
 * @param message
 * @returns signMessageResponse
 */
export async function signMessage(
  this: MetamaskFilecoinSnap,
  message: SignMessageRequest['params']
): Promise<SignMessageResponse> {
  return await sendSnapMethod(
    { method: 'fil_signMessage', params: message },
    this.snapId
  )
}

/**
 * Sign a raw message
 *
 * @param rawMessage
 * @returns signMessageRawResponse
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
 * Send a message
 *
 * @param signedMessage
 * @returns messageStatus
 */
export async function sendMessage(
  this: MetamaskFilecoinSnap,
  signedMessage: SignedMessage
): Promise<MessageStatus> {
  return await sendSnapMethod(
    { method: 'fil_sendMessage', params: signedMessage },
    this.snapId
  )
}

/**
 * Get the messages from the state
 *
 * @returns messages
 */
export async function getMessages(
  this: MetamaskFilecoinSnap
): Promise<MessageStatus[]> {
  return await sendSnapMethod({ method: 'fil_getMessages' }, this.snapId)
}

/**
 * Get the gas estimate for a message
 *
 * @param message
 * @param maxFee
 * @returns messageGasEstimate
 */
export async function calculateGasForMessage(
  this: MetamaskFilecoinSnap,
  message: EstimateMessageGasRequest['params']['message'],
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
