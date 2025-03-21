import { base64pad } from 'iso-base/rfc4648'
import { accountToLotus } from 'iso-filecoin/wallet'
import { getAccountWithPrivateKey } from '../account'
import { ExportConfirm, PrivateKeyExport } from '../components/dialog-export'
import type { SnapContext, SnapResponse } from '../types'
import { serializeError } from '../utils'

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
          config={config}
          origin={ctx.origin}
          address={account.address.toString()}
          accountNumber={account.accountNumber}
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
            privateKey={base64pad.encode(account.privateKey)}
            lotusPrivateKey={accountToLotus({
              address: account.address,
              privateKey: account.privateKey,
              publicKey: account.pubKey,
              type: 'SECP256K1',
            })}
          />
        ),
      },
    })

    return { result: true, error: null }
  }
  return serializeError('User denied private key export')
}
