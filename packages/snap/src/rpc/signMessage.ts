/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { FilecoinNumber } from '@glif/filecoin-number/dist'
import { z } from 'zod'
import {
  transactionSign,
  transactionSignRaw,
  // @ts-expect-error - TODO: fix types
} from '@zondax/filecoin-signing-tools/js'
import { Message, MessageSchemaPartial } from 'iso-rpc'
import type { SignedMessage, SnapContext, SnapResponse } from '../types'
import { showConfirmationDialog } from '../util/confirmation'
import { messageCreator } from '../util/messageCreator'
import { serializeError } from '../utils'

// Schemas
export const signMessageParams = MessageSchemaPartial.omit({ from: true })
export const signMessageRawParams = z.object({
  message: z.string(),
})

// Types
export type SignMessageParams = z.infer<typeof signMessageParams>
export type SignMessageRawParams = z.infer<typeof signMessageRawParams>
export interface SignMessageRequest {
  method: 'fil_signMessage'
  params: SignMessageParams
}

export interface SignMessageRawRequest {
  method: 'fil_signMessageRaw'
  params: SignMessageRawParams
}
export type SignMessageResponse = SnapResponse<SignedMessage>
export type SignMessageRawResponse = SnapResponse<string>

/**
 * Sign a message
 *
 * @param ctx - Snap context
 * @param params - The message request
 */
export async function signMessage(
  ctx: SnapContext,
  params: SignMessageParams
): Promise<SignMessageResponse> {
  const _params = signMessageParams.safeParse(params)
  if (_params.success === false) {
    return serializeError(
      `Invalid params ${_params.error.message}`,
      _params.error
    )
  }

  // create message object
  const message = new Message({
    to: _params.data.to,
    from: ctx.keypair.address,
    value: _params.data.value,
    gasFeeCap: _params.data.gasFeeCap,
    gasLimit: _params.data.gasLimit,
    gasPremium: _params.data.gasPremium,
  })

  await message.prepare(ctx.rpc)

  // show confirmation
  const confirmation = await showConfirmationDialog(ctx.snap, {
    description: `It will be signed with address: **${message.from}**`,
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
      { message: 'gas limit:', value: `${message.gasLimit} aFIL` },
      { message: 'gas fee cap:', value: `${message.gasFeeCap} aFIL` },
      { message: 'gas premium:', value: `${message.gasPremium} aFIL` },
    ]),
  })

  let sig: SignedMessage
  if (confirmation) {
    sig = transactionSign(message, ctx.keypair.privateKey)
    return { result: sig }
  }
  return serializeError('User denied message signing')
}

/**
 * Sign a raw message
 *
 * @param ctx - Snap context
 * @param params - Parameters
 * @param params.message - The raw message
 */
export async function signMessageRaw(
  ctx: SnapContext,
  params: SignMessageRawParams
): Promise<SignMessageRawResponse> {
  const _params = signMessageRawParams.safeParse(params)
  if (!_params.success) {
    return serializeError(
      `Invalid params ${_params.error.message}`,
      _params.error
    )
  }

  const { message } = _params.data
  const confirmation = await showConfirmationDialog(ctx.snap, {
    description: `It will be signed with address: ${ctx.keypair.address}`,
    prompt: `Do you want to sign this message?`,
    textAreaContent: message,
  })

  let sig: string
  if (confirmation) {
    sig = transactionSignRaw(message, ctx.keypair.privateKey).toString('base64')
    return { result: sig }
  }

  return serializeError('User denied message signing')
}
