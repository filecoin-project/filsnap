import type { MessageStatus, SignedMessage } from '../types.js'
import type { SnapsGlobalObject } from '@metamask/snaps-types'
import { updateMessageInState } from '../filecoin/message.js'
import type { LotusRpcApi } from '../filecoin/types.js'

/**
 * Send a message to the network
 *
 * @param snap - The snap itself
 * @param api - The Lotus RPC API
 * @param signedMessage - The signed message
 */
export async function sendMessage(
  snap: SnapsGlobalObject,
  api: LotusRpcApi,
  signedMessage: SignedMessage
): Promise<MessageStatus> {
  const response = await api.mpoolPush(signedMessage)
  const messageStatus = {
    cid: response['/'],
    message: signedMessage.message,
  }
  await updateMessageInState(snap, messageStatus)
  return messageStatus
}
