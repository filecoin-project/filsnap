import { copyable, heading, panel, text } from '@metamask/snaps-ui'
import type { SnapContext, SnapResponse } from '../types'
import { serializeError, snapDialog } from '../utils'
import { base64pad } from 'iso-base/rfc4648'
import { parseDerivationPath } from 'iso-filecoin/utils'

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
  const { account } = parseDerivationPath(ctx.config.derivationPath)
  const conf = await snapDialog(ctx.snap, {
    type: 'confirmation',
    content: panel([
      heading(`Do you want to export your private key?`),
      text(
        'Warning: Never disclose this key. Anyone with your private keys can steal any assets held in your account.'
      ),
    ]),
  })

  if (conf) {
    await snapDialog(ctx.snap, {
      type: 'alert',
      content: panel([
        text(`Private key for Account ${account}`),
        copyable(base64pad.encode(ctx.account.privateKey)),
      ]),
    })

    return { result: true, error: null }
  }
  return serializeError('User denied private key export')
}
