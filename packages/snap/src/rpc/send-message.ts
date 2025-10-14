import { base64pad } from 'iso-base/rfc4648'
import { Schemas } from 'iso-filecoin/message'
import { RPC } from 'iso-filecoin/rpc'
import { z } from 'zod/v4'
import type { MessageStatus, SnapContext, SnapResponse } from '../types.ts'
import { serializeError } from '../utils.ts'

// Schemas
export const signedMessage = z.object({
  message: Schemas.message,
  signature: z.object({
    type: z.literal('SECP256K1'),
    data: z.string().base64(),
  }),
})

// Types
export type SignedMessage = z.infer<typeof signedMessage>
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
