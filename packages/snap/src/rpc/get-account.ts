import { RPC } from 'iso-filecoin/rpc'
import { getAccountSafe } from '../account'
import type { AccountInfo, SnapContext, SnapResponse } from '../types'
import { serializeError } from '../utils'

// Types
export type GetAccountInfoResponse = SnapResponse<AccountInfo>

/**
 * Get the balance of the current account
 *
 * @param ctx - Snaps context
 * @returns Balance of the account in attoFIL
 */
export async function getAccountInfo(
  ctx: SnapContext
): Promise<GetAccountInfoResponse> {
  const config = await ctx.state.get(ctx.origin)

  if (config == null) {
    return serializeError(
      `No configuration found for ${ctx.origin}. Connect to Filsnap first.`
    )
  }

  const account = await getAccountSafe(snap, config)
  const rpc = new RPC({
    api: config.rpc.url,
    network: config.network,
  })
  const balance = await rpc.balance(account.address.toString())

  if (balance.error != null) {
    return serializeError('RPC call to "WalletBalance" failed', balance.error)
  }

  return {
    error: null,
    result: {
      address: account.address.toString(),
      pubKey: account.pubKey.toString(),
      balance: balance.result,
      config,
    },
  }
}
