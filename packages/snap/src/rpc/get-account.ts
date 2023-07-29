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
  const balance = await ctx.rpc.balance(ctx.account.address.toString())
  if (balance.error != null) {
    return serializeError('RPC call to "WalletBalance" failed', balance.error)
  }
  return {
    error: undefined,
    result: {
      address: ctx.account.address.toString(),
      pubKey: ctx.account.pubKey.toString(),
      balance: balance.result,
      config: ctx.config,
    },
  }
}
