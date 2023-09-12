import { RPC } from 'iso-filecoin/rpc'
import type { SnapContext, SnapResponse } from '../types'
import { serializeError } from '../utils'
import { getAccountSafe } from '../account'

// Types
export type GetBalanceResponse = SnapResponse<string>

export interface GetBalanceRequest {
  method: 'fil_getBalance'
}

/**
 * Get the balance of the current account
 *
 * @param ctx - Snaps context
 * @returns Balance of the account in attoFIL
 */
export async function getBalance(
  ctx: SnapContext
): Promise<GetBalanceResponse> {
  const config = await ctx.state.get(ctx.origin)

  if (config == null) {
    return serializeError(
      `No configuration found for ${ctx.origin}. Connect to Filsnap first.`
    )
  }
  const rpc = new RPC({
    api: config.rpc.url,
    network: config.network,
  })
  const account = await getAccountSafe(snap, config)
  const balance = await rpc.balance(account.address.toString())

  if (balance.error != null) {
    return serializeError('RPC call to "WalletBalance" failed', balance.error)
  }
  return { result: balance.result, error: null }
}
