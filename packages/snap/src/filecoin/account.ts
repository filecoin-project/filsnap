import { getBIP44AddressKeyDeriver } from '@metamask/key-tree'
import { type SnapsGlobalObject } from '@metamask/snaps-types'
import { accountFromPrivateKey } from 'iso-filecoin/wallet'
import { parseDerivationPath } from 'iso-filecoin/utils'
import type { Account } from '../types'
import { configFromSnap } from '../utils'
/**
 * Return derived KeyPair from seed.
 *
 * @param snap - Snaps object
 */
export async function getKeyPair(snap: SnapsGlobalObject): Promise<Account> {
  const config = await configFromSnap(snap)
  const { derivationPath } = config
  const { coinType, account, change, addressIndex } =
    parseDerivationPath(derivationPath)
  const isFilecoinMainnet = coinType === 461
  const bip44Node = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType,
    },
  })

  const addressKeyDeriver = await getBIP44AddressKeyDeriver(bip44Node, {
    account,
    change,
  })
  const extendedPrivateKey = await addressKeyDeriver(addressIndex)

  const privateKey = extendedPrivateKey.privateKeyBytes
  if (privateKey == null) {
    throw new Error('Private key not found')
  }
  const privateKeyBuffer = privateKey.subarray(0, 32)

  return accountFromPrivateKey(
    privateKeyBuffer,
    'SECP256K1',
    isFilecoinMainnet ? 'mainnet' : 'testnet'
  )
}
