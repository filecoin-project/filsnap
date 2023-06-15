import { type SnapsGlobalObject } from '@metamask/snaps-types'
import { getKeyPair } from '../filecoin/account'

/**
 * Get the public key from the state
 *
 * @param snap - The snap itself
 */
export async function getPublicKey(snap: SnapsGlobalObject): Promise<string> {
  const keyPair = await getKeyPair(snap)
  return keyPair.publicKey
}
