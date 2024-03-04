import { copyable, divider, heading, panel, text } from '@metamask/snaps-sdk'
import { base64pad } from 'iso-base/rfc4648'
import * as Address from 'iso-filecoin/address'
import { Message, Schemas } from 'iso-filecoin/message'
import { Token } from 'iso-filecoin/token'
import { signMessage as filSignMessage, sign } from 'iso-filecoin/wallet'
import { z } from 'zod'
import { RPC } from 'iso-filecoin/rpc'
import { parseDerivationPath } from 'iso-filecoin/utils'
import type { SnapContext, SnapResponse } from '../types'
import { serializeError, snapDialog } from '../utils'
import { getAccount } from '../account'
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

  const gas = Token.fromAttoFIL(message.gasPremium).mul(message.gasLimit)
  const total = Token.fromAttoFIL(message.value).add(gas)
  const { account: accountNumber } = parseDerivationPath(config.derivationPath)
  const conf = await snapDialog(ctx.snap, {
    type: 'confirmation',
    content: panel([
      heading(`Request from ${ctx.origin}`),
      text(
        `Send **${Token.fromAttoFIL(message.value).toFIL().toString()} ${
          config.unit?.symbol ?? 'FIL'
        }** from Account ${accountNumber}`
      ),
      copyable(message.from),
      text(`to`),
      copyable(message.to),
      divider(),
      heading('Details'),
      text(`Gas _(estimated ${config.unit?.symbol ?? 'FIL'})_:`),
      copyable(
        gas.toFIL().toFormat({
          decimalPlaces: config.unit?.decimals,
        })
      ),
      text(`Total _(amount + gas ${config.unit?.symbol ?? 'FIL'})_:`),
      copyable(
        total.toFIL().toFormat({
          decimalPlaces: config.unit?.decimals,
        })
      ),
      text('API:'),
      copyable(config.rpc.url),
      text('Network:'),
      copyable(config.network),
    ]),
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
  const { account: accountNumber } = parseDerivationPath(config.derivationPath)

  const conf = await snapDialog(ctx.snap, {
    type: 'confirmation',
    content: panel([
      heading(`Request from ${ctx.origin}`),
      text(
        `Do you want to sign this message with **Account ${accountNumber}** _${account.address.toString()}_?`
      ),
      copyable(message),
    ]),
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
