import { heading, panel } from '@metamask/snaps-ui'
import type { SnapContext, SnapResponse } from '../types'
import { serializeError, snapDialog } from '../utils'
import { base64pad } from 'iso-base/rfc4648'

// Types
export type ExportPrivateKeyResponse = SnapResponse<string>

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
  const conf = await snapDialog(ctx.snap, {
    type: 'confirmation',
    content: panel([heading(`Do you want to export your private key?`)]),
  })

  if (conf) {
    return {
      result: base64pad.encode(ctx.account.privateKey),
      error: null,
    }
  }
  return serializeError('User denied private key export')
}
