import { getBIP44AddressKeyDeriver } from '@metamask/key-tree'
import { type SnapsGlobalObject } from '@metamask/snaps-types'
import { accountFromPrivateKey } from 'iso-filecoin/wallet'
import { parseDerivationPath } from 'iso-filecoin/utils'
import type { AddressBLS, AddressSecp256k1 } from 'iso-filecoin/address'
import type { Account, SnapConfig } from './types'

/**
 * Return derived Account from seed.
 *
 * @param snap - Snaps object
 * @param config - Snap configuration
 */
export async function getAccount(
  snap: SnapsGlobalObject,
  config: SnapConfig
): Promise<Account> {
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

/**
 * Return derived Account from seed without the private key.
 *
 * @param snap - Snaps object
 * @param config - Snap configuration
 */
export async function getAccountSafe(
  snap: SnapsGlobalObject,
  config: SnapConfig
): Promise<{ address: AddressSecp256k1 | AddressBLS; pubKey: Uint8Array }> {
  const { derivationPath } = config
  const {
    coinType,
    account: accountNumber,
    change,
    addressIndex,
  } = parseDerivationPath(derivationPath)
  const isFilecoinMainnet = coinType === 461
  const bip44Node = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType,
    },
  })

  const addressKeyDeriver = await getBIP44AddressKeyDeriver(bip44Node, {
    account: accountNumber,
    change,
  })
  const extendedPrivateKey = await addressKeyDeriver(addressIndex)

  const privateKey = extendedPrivateKey.privateKeyBytes
  if (privateKey == null) {
    throw new Error('Private key not found')
  }
  const privateKeyBuffer = privateKey.subarray(0, 32)

  let account = accountFromPrivateKey(
    privateKeyBuffer,
    'SECP256K1',
    isFilecoinMainnet ? 'mainnet' : 'testnet'
  )

  const address = account.address
  const pubKey = account.pubKey

  // @ts-expect-error - deref account
  account = null

  return { address, pubKey }
}
