/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { z } from 'zod'
import { Message, Schemas } from 'iso-filecoin/message'
import { Token } from 'iso-filecoin/token'
import { signMessage as filSignMessage, sign } from 'iso-filecoin/wallet'
import type { SignedMessage, SnapContext, SnapResponse } from '../types'
import {
  createUIMessage,
  serializeError,
  showConfirmationDialog,
} from '../utils'
import { base64pad } from 'iso-base/rfc4648'

// Schemas
export const signMessageParams = Schemas.messagePartial.omit({
  from: true,
})
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
  if (!_params.success) {
    return serializeError(
      `Invalid params ${_params.error.message}`,
      _params.error
    )
  }

  // create Message
  const message = await new Message({
    to: _params.data.to,
    from: ctx.account.address.toString(),
    value: _params.data.value,
    nonce: _params.data.nonce,
    gasFeeCap: _params.data.gasFeeCap,
    gasLimit: _params.data.gasLimit,
    gasPremium: _params.data.gasPremium,
    params: _params.data.params,
    method: _params.data.method,
  }).prepare(ctx.rpc)

  // show confirmation
  const confirmation = await showConfirmationDialog(ctx.snap, {
    description: `It will be signed with address: **${message.from}**`,
    prompt: `Do you want to sign this message?`,
    textAreaContent: createUIMessage([
      { message: 'to:', value: message.to },
      { message: 'from:', value: message.from },
      {
        message: 'value:',
        value: `${Token.fromAttoFIL(message.value).toFIL()} FIL`,
      },
      { message: 'method:', value: message.method },
      { message: 'params:', value: message.params },
      { message: 'gas limit:', value: `${message.gasLimit} aFIL` },
      { message: 'gas fee cap:', value: `${message.gasFeeCap} aFIL` },
      { message: 'gas premium:', value: `${message.gasPremium} aFIL` },
    ]),
  })

  if (confirmation) {
    const sig = filSignMessage(ctx.account.privateKey, 'SECP256K1', message)
    return {
      result: {
        message,
        signature: {
          data: base64pad.encode(sig),
          type: 'SECP256K1',
        },
      },
    }
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
    description: `It will be signed with address: ${ctx.account.address}`,
    prompt: `Do you want to sign this message?`,
    textAreaContent: message,
  })

  if (confirmation) {
    const sig = sign(ctx.account.privateKey, 'SECP256K1', message)
    return {
      result: base64pad.encode(sig),
    }
  }

  return serializeError('User denied message signing')
}
