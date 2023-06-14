import { getBIP44AddressKeyDeriver } from '@metamask/key-tree'
import { type SnapsGlobalObject } from '@metamask/snaps-types'
import type { KeyPair } from '../types.js'
// @ts-expect-error - no types
import { keyRecover } from '@zondax/filecoin-signing-tools/js'
import { Buffer } from 'buffer'
import { parseDerivationPath, configFromSnap } from '../utils.js'

/**
 * Return derived KeyPair from seed.
 *
 * @param snap - Snaps object
 */
export async function getKeyPair(snap: SnapsGlobalObject): Promise<KeyPair> {
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

  // TODO - remove dependency on filecoin-signing-tools and Buffer
  const extendedKey = keyRecover(
    Buffer.from(privateKeyBuffer),
    !isFilecoinMainnet
  )

  return {
    address: extendedKey.address,
    privateKey: extendedKey.private_base64,
    publicKey: extendedKey.public_hexstring,
  }
}
