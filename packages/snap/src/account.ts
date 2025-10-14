import { getBIP44AddressKeyDeriver } from '@metamask/key-tree'
import type { SnapsProvider } from '@metamask/snaps-sdk'
import { parseDerivationPath } from 'iso-filecoin/utils'
import { accountFromPrivateKey } from 'iso-filecoin/wallet'
import type { AccountPrivate, AccountSafe, SnapConfig } from './types.ts'

/**
 * Return derived Account from seed with private key.
 *
 * @param snap - Snaps object
 * @param config - Snap configuration
 */
export async function getAccountWithPrivateKey(
  snap: SnapsProvider,
  config: SnapConfig
): Promise<AccountPrivate> {
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
  const acc = accountFromPrivateKey(
    privateKeyBuffer,
    'SECP256K1',
    isFilecoinMainnet ? 'mainnet' : 'testnet'
  )
  return {
    address: acc.address,
    pubKey: acc.publicKey,
    privateKey: privateKeyBuffer,
    path: derivationPath,
    accountNumber: addressIndex,
  }
}

/**
 * Return derived Account from seed without the private key.
 *
 * @param snap - Snaps object
 * @param config - Snap configuration
 */
export async function getAccountSafe(
  snap: SnapsProvider,
  config: SnapConfig
): Promise<AccountSafe> {
  const { derivationPath, derivationMode } = config
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

  let acc = accountFromPrivateKey(
    privateKeyBuffer,
    'SECP256K1',
    isFilecoinMainnet ? 'mainnet' : 'testnet'
  )

  const address = acc.address
  const pubKey = acc.publicKey

  // @ts-expect-error - deref account
  acc = null

  return {
    address,
    pubKey,
    accountNumber: derivationMode === 'ledger' ? account : addressIndex,
    path: derivationPath,
  }
}
