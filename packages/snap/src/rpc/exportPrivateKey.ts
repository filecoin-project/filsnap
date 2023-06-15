import { type SnapsGlobalObject } from '@metamask/snaps-types'
import { getKeyPair } from '../filecoin/account'
import { showConfirmationDialog } from '../util/confirmation'

/**
 * Export the private key of the current account
 *
 * @param snap - Snaps object
 * @returns Private key of the current account
 */
export async function exportPrivateKey(
  snap: SnapsGlobalObject
): Promise<string | null> {
  // ask for confirmation
  const confirmation = await showConfirmationDialog(snap, {
    prompt: 'Do you want to export your private key?',
  })
  // return private key if user confirmed actions
  if (confirmation) {
    const keypair = await getKeyPair(snap)
    return keypair.privateKey
  }
  return null
}
