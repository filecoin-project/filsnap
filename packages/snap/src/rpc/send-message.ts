import type {
  MessageStatus,
  SignedMessage,
  SnapContext,
  SnapResponse,
} from '../types'
import { serializeError, updateMessageInState } from '../utils'
import { base64pad } from 'iso-base/rfc4648'

// Types
export interface SendMessageRequest {
  method: 'fil_sendMessage'
  params: SignedMessage
}
export type SendMessageResponse = SnapResponse<MessageStatus>

/**
 * Send a message to the network
 *
 * @param ctx - Snap context
 * @param params - The signed message
 */
export async function sendMessage(
  ctx: SnapContext,
  params: SignedMessage
): Promise<SendMessageResponse> {
  const response = await ctx.rpc.pushMessage(params.message, {
    type: params.signature.type,
    data: base64pad.decode(params.signature.data),
  })

  if (response.error != null) {
    return serializeError('RPC call to "MpoolPush" failed', response.error)
  }
  const messageStatus = {
    cid: response.result['/'],
    message: params.message,
  }
  await updateMessageInState(snap, messageStatus)
  return { result: messageStatus, error: undefined }
}
