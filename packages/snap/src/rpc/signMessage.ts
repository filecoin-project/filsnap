import type {
  Message,
  SignedMessage,
  MessageRequest,
  SignMessageResponse,
  SignRawMessageResponse,
} from '../types'
import { FilecoinNumber } from '@glif/filecoin-number/dist'
import { type SnapsGlobalObject } from '@metamask/snaps-types'
import {
  transactionSign,
  transactionSignRaw,
  // @ts-expect-error - no types
} from '@zondax/filecoin-signing-tools/js'
import { getKeyPair } from '../filecoin/account'
import { type LotusRpcApi } from '../filecoin/types'
import { showConfirmationDialog } from '../util/confirmation'
import { messageCreator } from '../util/messageCreator'

/**
 * Sign a message
 *
 * @param snap - The snap itself
 * @param api - The Lotus RPC API
 * @param messageRequest - The message request
 */
export async function signMessage(
  snap: SnapsGlobalObject,
  api: LotusRpcApi,
  messageRequest: MessageRequest
): Promise<SignMessageResponse> {
  try {
    const keypair = await getKeyPair(snap)
    // extract gas params
    const gl =
      messageRequest.gaslimit != null && messageRequest.gaslimit !== 0
        ? messageRequest.gaslimit
        : 0
    const gp =
      messageRequest.gaspremium != null && messageRequest.gaspremium !== '0'
        ? messageRequest.gaspremium
        : '0'
    const gfc =
      messageRequest.gasfeecap != null && messageRequest.gasfeecap !== '0'
        ? messageRequest.gasfeecap
        : '0'
    const nonce =
      messageRequest.nonce ?? Number(await api.mpoolGetNonce(keypair.address))
    const params = messageRequest.params ?? ''
    const method = messageRequest.method ?? 0

    // create message object
    const message: Message = {
      from: keypair.address,
      gasfeecap: gfc,
      gaslimit: gl,
      gaspremium: gp,
      method,
      nonce,
      params,
      to: messageRequest.to,
      value: messageRequest.value,
    }
    // estimate gas usage if gas params not provided
    if (
      message.gaslimit === 0 &&
      message.gasfeecap === '0' &&
      message.gaspremium === '0'
    ) {
      const messageEstimate = await api.gasEstimateMessageGas(
        message,
        { MaxFee: '0' },
        null
      )
      message.gaslimit = messageEstimate.GasLimit
      message.gaspremium = messageEstimate.GasPremium
      message.gasfeecap = messageEstimate.GasFeeCap
    }

    // show confirmation
    const confirmation = await showConfirmationDialog(snap, {
      description: `It will be signed with address: ${message.from}`,
      prompt: `Do you want to sign this message?`,
      textAreaContent: messageCreator([
        { message: 'to:', value: message.to },
        { message: 'from:', value: message.from },
        {
          message: 'value:',
          value: `${new FilecoinNumber(message.value, 'attofil').toFil()} FIL`,
        },
        { message: 'method:', value: message.method },
        { message: 'params:', value: message.params },
        { message: 'gas limit:', value: `${message.gaslimit} aFIL` },
        { message: 'gas fee cap:', value: `${message.gasfeecap} aFIL` },
        { message: 'gas premium:', value: `${message.gaspremium} aFIL` },
      ]),
    })

    let sig: SignedMessage
    if (confirmation) {
      sig = transactionSign(message, keypair.privateKey)
      return { confirmed: confirmation, error: undefined, signedMessage: sig }
    }
    return {
      confirmed: confirmation,
      error: new Error('Confirmation failed.'),
      signedMessage: undefined,
    }
  } catch (error: unknown) {
    return { confirmed: false, error: error as Error, signedMessage: undefined }
  }
}

/**
 * Sign a raw message
 *
 * @param snap - The snap itself
 * @param rawMessage - The raw message
 */
export async function signMessageRaw(
  snap: SnapsGlobalObject,
  rawMessage: string
): Promise<SignRawMessageResponse> {
  try {
    const keypair = await getKeyPair(snap)

    const confirmation = await showConfirmationDialog(snap, {
      description: `It will be signed with address: ${keypair.address}`,
      prompt: `Do you want to sign this message?`,
      textAreaContent: rawMessage,
    })

    let sig: string
    if (confirmation) {
      sig = transactionSignRaw(rawMessage, keypair.privateKey).toString(
        'base64'
      )
      return { confirmed: confirmation, error: undefined, signature: sig }
    }

    return {
      confirmed: false,
      error: new Error('Confirmation failed.'),
      signature: undefined,
    }
  } catch (error: unknown) {
    return { confirmed: false, error: error as Error, signature: undefined }
  }
}
