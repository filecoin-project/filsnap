import { base64pad } from 'iso-base/rfc4648'
import { accountToLotus } from 'iso-filecoin/wallet'
import { getAccountWithPrivateKey } from '../account.ts'
import {
  ExportConfirm,
  PrivateKeyExport,
} from '../components/dialog-export.tsx'
import type { SnapContext, SnapResponse } from '../types.ts'
import { serializeError } from '../utils.ts'

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

  const account = await getAccountWithPrivateKey(snap, config)

  const conf = await ctx.snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: (
        <ExportConfirm
          accountNumber={account.accountNumber}
          address={account.address.toString()}
          config={config}
          origin={ctx.origin}
        />
      ),
    },
  })

  if (conf) {
    await ctx.snap.request({
      method: 'snap_dialog',
      params: {
        type: 'alert',
        content: (
          <PrivateKeyExport
            lotusPrivateKey={accountToLotus({
              address: account.address,
              privateKey: account.privateKey,
              publicKey: account.pubKey,
              type: 'SECP256K1',
            })}
            privateKey={base64pad.encode(account.privateKey)}
          />
        ),
      },
    })

    return { result: true, error: null }
  }
  return serializeError('User denied private key export')
}
