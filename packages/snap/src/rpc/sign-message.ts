/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { z } from 'zod'
import { Message, Schemas } from 'iso-filecoin/message'
import { Token } from 'iso-filecoin/token'
import { sign } from 'iso-filecoin/wallet'
import type { SignedMessage, SnapContext, SnapResponse } from '../types'
import { copyable, divider, heading, panel, text } from '@metamask/snaps-ui'
import { getFilAddress, getNetworkPrefix, serializeError, snapDialog } from '../utils'
import { base64pad } from 'iso-base/rfc4648'
import { Transaction, Wallet } from '@stfil/filecoin-utils'
import { SignatureType } from '@stfil/filecoin-utils/build/artifacts/wallet'

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
    to: getFilAddress(ctx, _params.data.to),
    from: ctx.account.address.toString(),
    value: _params.data.value,
    nonce: _params.data.nonce,
    gasFeeCap: _params.data.gasFeeCap,
    gasLimit: _params.data.gasLimit,
    gasPremium: _params.data.gasPremium,
    params: _params.data.params,
    method: _params.data.method,
  }).prepare(ctx.rpc)

  const gas = Token.fromAttoFIL(message.gasPremium).mul(message.gasLimit)
  const total = Token.fromAttoFIL(message.value).add(gas)
  const conf = await snapDialog(ctx.snap, {
    type: 'confirmation',
    content: panel([
      heading(
        `Send ${Token.fromAttoFIL(message.value).toFIL().toFormat(10)} FIL to`
      ),
      copyable(_params.data.to),
      divider(),
      heading('Details'),
      text(`Gas _(estimated)_: **${gas.toFIL().toFormat(10)} FIL**`),
      text(`Total _(amount + gas)_: **${total.toFIL().toFormat(10)} FIL**`),
    ]),
  })

  if (conf) {
    const accountData = Wallet.recoverAccount(getNetworkPrefix(ctx), SignatureType.SECP256K1, base64pad.encode(ctx.account.privateKey))
    const signature = (await Wallet.signTransaction(accountData, Transaction.fromJSON({
      To: message.to,
      From: message.from,
      Value: message.value,
      Params: message.params,
      GasFeeCap: message.gasFeeCap,
      GasPremium: message.gasPremium,
      GasLimit: message.gasLimit,
      Nonce: message.nonce,
      Method: message.method,
    }))).toJSON()
    const sig = {message, signature: {data: signature.Data, type: signature.Type}}
    return {
      result: {
        message,
        signature: {
          data: sig.signature.data,
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

  const conf = await snapDialog(ctx.snap, {
    type: 'confirmation',
    content: panel([
      heading(`Do you want to sign this message?`),
      copyable(message),
    ]),
  })

  if (conf) {
    const sig = sign(ctx.account.privateKey, 'SECP256K1', message)
    return {
      result: base64pad.encode(sig),
    }
  }

  return serializeError('User denied message signing')
}
