import * as Address from 'iso-filecoin/address'
import { useFilsnap } from 'filsnap-adapter-react'

/**
 *
 * @param {object} param0
 * @param {string} [param0.address]
 * @param {'filecoin' | 'ethereum'} [param0.chain]
 */
export default function ExplorerLink({ address, chain }) {
  const { account } = useFilsnap()

  if (!address) return null

  if (chain === 'filecoin') {
    const fAddress = Address.from(address, account?.config.network).toString()
    return (
      <div>
        ⨎{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://explorer.glif.io/address/${fAddress}/?network=${
            account?.config.network === 'mainnet' ? 'mainnet' : 'calibrationnet'
          }`}
        >
          {fAddress || 'unknown'}
        </a>
      </div>
    )
  }

  return (
    <div>
      Ξ{' '}
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://explorer.glif.io/address/${address}/?network=${
          account?.config.network === 'mainnet' ? 'mainnet' : 'calibrationnet'
        }`}
      >
        {address || 'unknown'}
      </a>
    </div>
  )
}
