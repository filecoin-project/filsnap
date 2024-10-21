import { base64pad } from 'iso-base/rfc4648'
import * as Address from 'iso-filecoin/address'
import { Message, Schemas } from 'iso-filecoin/message'
import { RPC } from 'iso-filecoin/rpc'
import { signMessage as filSignMessage, sign } from 'iso-filecoin/wallet'
import { z } from 'zod'
import { getAccount } from '../account'
import { SignMessageDialog, SignRawDialog } from '../components/sign'
import type { SnapContext, SnapResponse } from '../types'
import { serializeError } from '../utils'
import type { SignedMessage } from './send-message'

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
  const config = await ctx.state.get(ctx.origin)

  if (config == null) {
    return serializeError(
      `No configuration found for ${ctx.origin}. Connect to Filsnap first.`
    )
  }

  const _params = signMessageParams.safeParse(params)
  if (!_params.success) {
    return serializeError(
      `Invalid params ${_params.error.message}`,
      _params.error
    )
  }

  const account = await getAccount(snap, config)
  const rpc = new RPC({
    api: config.rpc.url,
    network: config.network,
  })
  // create Message
  const message = await new Message({
    to: Address.from(_params.data.to, config.network).toString(),
    from: account.address.toString(),
    value: _params.data.value,
    nonce: _params.data.nonce,
    gasFeeCap: _params.data.gasFeeCap,
    gasLimit: _params.data.gasLimit,
    gasPremium: _params.data.gasPremium,
    params: _params.data.params,
    method: _params.data.method,
  }).prepare(rpc)

  const conf = await ctx.snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: (
        <SignMessageDialog
          accountNumber={account.accountNumber}
          message={message}
          config={config}
          origin={ctx.origin}
        />
      ),
    },
  })

  if (conf) {
    const sig = filSignMessage(account.privateKey, 'SECP256K1', message)
    return {
      error: null,
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
  const config = await ctx.state.get(ctx.origin)

  if (config == null) {
    return serializeError(
      `No configuration found for ${ctx.origin}. Connect to Filsnap first.`
    )
  }
  const _params = signMessageRawParams.safeParse(params)
  if (!_params.success) {
    return serializeError(
      `Invalid params ${_params.error.message}`,
      _params.error
    )
  }

  const { message } = _params.data

  const account = await getAccount(snap, config)

  const conf = await ctx.snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: (
        <SignRawDialog
          origin={ctx.origin}
          accountNumber={account.accountNumber}
          message={message}
        />
      ),
    },
  })

  if (conf) {
    const sig = sign(account.privateKey, 'SECP256K1', message)
    return {
      error: null,
      result: base64pad.encode(sig),
    }
  }

  return serializeError('User denied message signing')
}