import { FilecoinNumber } from '@glif/filecoin-number'
import { type SnapsGlobalObject } from '@metamask/snaps-types'
import { getKeyPair } from '../filecoin/account.js'
import { type LotusRpcApi } from '../filecoin/types.js'

/**
 * Get the balance of the current account
 *
 * @param snap - Snaps object
 * @param api - LotusRpcApi object
 * @param address - Address to get balance of
 */
export async function getBalance(
  snap: SnapsGlobalObject,
  api: LotusRpcApi,
  address?: string
): Promise<string> {
  if (address == null) {
    const kp = await getKeyPair(snap)
    address = kp.address
  }
  const balance = await api.walletBalance(address)
  return new FilecoinNumber(balance, 'attofil').toFil()
}
