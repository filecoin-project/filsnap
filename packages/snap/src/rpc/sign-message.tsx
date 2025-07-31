import { base64pad } from 'iso-base/rfc4648'
import { utf8 } from 'iso-base/utf8'
import * as Address from 'iso-filecoin/address'
import { Message, Schemas } from 'iso-filecoin/message'
import { RPC } from 'iso-filecoin/rpc'
import {
  signMessage as filSignMessage,
  personalSign,
  sign,
} from 'iso-filecoin/wallet'
import { z } from 'zod'
import { getAccountWithPrivateKey } from '../account'
import {
  SignMessageDialog,
  SignTransactionDialog,
} from '../components/dialog-sign'
import type { SnapContext, SnapResponse } from '../types'
import { serializeError, serializeValidationError } from '../utils'
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
    return serializeValidationError(_params.error)
  }

  const account = await getAccountWithPrivateKey(snap, config)
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
        <SignTransactionDialog
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
          data: base64pad.encode(sig.data),
          type: 'SECP256K1',
        },
      },
    }
  }
  return serializeError('User denied message signing')
}

/**
 * Sign a raw UTF-8 message
 *
 * @deprecated Use {@link filSign} instead
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
    return serializeValidationError(_params.error)
  }

  const { message } = _params.data

  const account = await getAccountWithPrivateKey(snap, config)

  const conf = await ctx.snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: (
        <SignMessageDialog
          address={account.address.toString()}
          origin={ctx.origin}
          accountNumber={account.accountNumber}
          message={message}
        />
      ),
    },
  })

  if (conf) {
    const sig = sign(account.privateKey, 'SECP256K1', utf8.decode(message))
    return {
      error: null,
      result: base64pad.encode(sig.data),
    }
  }

  return serializeError('User denied message signing')
}

export const signBytesParams = z.object({
  /**
   * Base64 encoded bytes to sign
   */
  data: z.base64(),
})

/**
 * Sign a arbitrary bytes
 *
 * @param ctx - Snap context
 * @param params - Parameters
 * @param params.data - bytes to sign in base64 format
 * @returns Signature in Lotus format (hex encoded) {@link Signature.toLotusHex}
 */
export async function filSign(
  ctx: SnapContext,
  params: z.infer<typeof signBytesParams>
): Promise<SignMessageRawResponse> {
  const config = await ctx.state.get(ctx.origin)

  if (config == null) {
    return serializeError(
      `No configuration found for ${ctx.origin}. Connect to Filsnap first.`
    )
  }
  const _params = signBytesParams.safeParse(params)
  if (!_params.success) {
    return serializeValidationError(_params.error)
  }

  const { data } = _params.data
  const decodedBytes = base64pad.decode(data)

  const account = await getAccountWithPrivateKey(snap, config)

  const conf = await ctx.snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: (
        <SignMessageDialog
          address={account.address.toString()}
          origin={ctx.origin}
          accountNumber={account.accountNumber}
          message={utf8.encode(decodedBytes)}
        />
      ),
    },
  })

  if (conf) {
    const sig = sign(account.privateKey, 'SECP256K1', decodedBytes)
    return {
      error: null,
      result: sig.toLotusHex(),
    }
  }

  return serializeError('User denied message signing')
}

/**
 * Sign a FRC-102 message
 *
 * @param ctx - Snap context
 * @param params - Parameters
 * @param params.data - bytes to sign in base64 format
 * @returns Signature in Lotus format (hex encoded) {@link Signature.toLotusHex}
 */
export async function filPersonalSign(
  ctx: SnapContext,
  params: z.infer<typeof signBytesParams>
): Promise<SignMessageRawResponse> {
  const config = await ctx.state.get(ctx.origin)

  if (config == null) {
    return serializeError(
      `No configuration found for ${ctx.origin}. Connect to Filsnap first.`
    )
  }
  const _params = signBytesParams.safeParse(params)
  if (!_params.success) {
    return serializeValidationError(_params.error)
  }

  const { data } = _params.data
  const decodedBytes = base64pad.decode(data)

  const account = await getAccountWithPrivateKey(snap, config)

  const conf = await ctx.snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: (
        <SignMessageDialog
          address={account.address.toString()}
          origin={ctx.origin}
          accountNumber={account.accountNumber}
          message={utf8.encode(decodedBytes)}
        />
      ),
    },
  })

  if (conf) {
    const sig = personalSign(account.privateKey, 'SECP256K1', decodedBytes)
    return {
      error: null,
      result: sig.toLotusHex(),
    }
  }

  return serializeError('User denied message signing')
}
