import { copyable, divider, panel, text } from '@metamask/snaps-sdk'
import { base64pad } from 'iso-base/rfc4648'
import { parseDerivationPath } from 'iso-filecoin/utils'
import type { SnapContext, SnapResponse } from '../types'
import { serializeError, snapDialog } from '../utils'
import { getAccount } from '../account'

// Types
export type ExportPrivateKeyResponse = SnapResponse<boolean>

export interface ExportPrivateKeyRequest {
  method: 'fil_exportPrivateKey'
}

/**
 * Export the private key of the current account
 *
 * @param ctx - Snaps context
 * @returns Private key of the current account
 */
export async function exportPrivateKey(
  ctx: SnapContext
): Promise<ExportPrivateKeyResponse> {
  const config = await ctx.state.get(ctx.origin)

  if (config == null) {
    return serializeError(
      `No configuration found for ${ctx.origin}. Connect to Filsnap first.`
    )
  }

  const account = await getAccount(snap, config)

  const { account: accountNumber } = parseDerivationPath(config.derivationPath)
  const conf = await snapDialog(ctx.snap, {
    type: 'confirmation',
    content: panel([
      text(
        `Do you want to export **Account ${accountNumber}** _${account.address.toString()}_ your private key?`
      ),
      divider(),
      text(
        'Warning: Never disclose this key. Anyone with your private keys can steal any assets held in your account.'
      ),
    ]),
  })

  if (conf) {
    await snapDialog(ctx.snap, {
      type: 'alert',
      content: panel([
        text(
          `Private key for **Account ${accountNumber}** _${account.address.toString()}_`
        ),
        copyable(base64pad.encode(account.privateKey)),
      ]),
    })

    return { result: true, error: null }
  }
  return serializeError('User denied private key export')
}
