import type { SnapContext, SnapResponse } from '../types'
import { serializeError, showConfirmationDialog } from '../utils'
import { base64pad } from 'iso-base/rfc4648'

// Types
export type ExportPrivateKeyResponse = SnapResponse<string>

/**
 * Export the private key of the current account
 *
 * @param ctx - Snaps context
 * @returns Private key of the current account
 */
export async function exportPrivateKey(
  ctx: SnapContext
): Promise<ExportPrivateKeyResponse> {
  // ask for confirmation
  const confirmation = await showConfirmationDialog(ctx.snap, {
    prompt: 'Do you want to export your private key?',
  })
  // return private key if user confirmed actions
  if (confirmation) {
    return { result: base64pad.encode(ctx.account.privateKey) }
  }
  return serializeError('User denied private key export')
}
