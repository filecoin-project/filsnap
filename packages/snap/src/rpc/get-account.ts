import { hex } from 'iso-base/rfc4648'
import { RPC } from 'iso-filecoin/rpc'
import { getAccountSafe } from '../account.ts'
import type { AccountInfo, SnapContext, SnapResponse } from '../types.ts'
import { serializeError } from '../utils.ts'

// Types
export type GetAccountInfoResponse = SnapResponse<AccountInfo>

/**
 * Get the account info and balance of the current account
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

export interface IAccountSerialized {
  address: string
  /**
   * Hex encoded public key
   */
  publicKey: string
  path: string
  type: 'SECP256K1'
}

/**
 * RPC method to get the account info of the current account
 *
 * @param ctx - Snaps context
 */
export async function filGetAccount(
  ctx: SnapContext
): Promise<SnapResponse<IAccountSerialized>> {
  const config = await ctx.state.get(ctx.origin)

  if (config == null) {
    return serializeError(
      `No configuration found for ${ctx.origin}. Connect to Filsnap first.`
    )
  }

  const account = await getAccountSafe(snap, config)

  return {
    error: null,
    result: {
      address: account.address.toString(),
      publicKey: hex.encode(account.pubKey),
      path: config.derivationPath,
      type: 'SECP256K1',
    },
  }
}
