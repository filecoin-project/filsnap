import { RPC } from 'iso-filecoin/rpc'
import { base64pad } from 'iso-base/rfc4648'
import type {
  MessageStatus,
  SignedMessage,
  SnapContext,
  SnapResponse,
} from '../types'
import { serializeError } from '../utils'

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
  const config = await ctx.state.get(ctx.origin)

  if (config == null) {
    return serializeError(
      `No configuration found for ${ctx.origin}. Connect to Filsnap first.`
    )
  }

  const rpc = new RPC({
    api: config.rpc.url,
    network: config.network,
  })
  const response = await rpc.pushMessage({
    msg: params.message,
    signature: {
      type: params.signature.type,
      data: base64pad.decode(params.signature.data),
    },
  })

  if (response.error != null) {
    return serializeError('RPC call to "MpoolPush" failed', response.error)
  }
  const messageStatus = {
    cid: response.result['/'],
    message: params.message,
  }
  return { result: messageStatus, error: null }
}
