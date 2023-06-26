import type { SnapContext, SnapResponse } from '../types'
import { serializeError } from '../utils'

export type GetBalanceResponse = SnapResponse<string>

/**
 * Get the balance of the current account
 *
 * @param ctx - Snaps context
 * @returns Balance of the account in attoFIL
 */
export async function getBalance(
  ctx: SnapContext
): Promise<GetBalanceResponse> {
  const balance = await ctx.rpc.balance(ctx.account.address.toString())
  if (balance.error != null) {
    return serializeError('RPC call to "WalletBalance" failed', balance.error)
  }
  return balance
}
