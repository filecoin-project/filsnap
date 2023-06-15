import { type SnapsGlobalObject } from '@metamask/snaps-types'
import { getKeyPair } from '../filecoin/account'

/**
 * Get the address of the current account
 *
 * @param snap - Snaps object
 */
export async function getAddress(snap: SnapsGlobalObject): Promise<string> {
  const keyPair = await getKeyPair(snap)
  return keyPair.address
}
