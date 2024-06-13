import { clsx } from 'clsx'
import { useFilsnap } from 'filsnap-adapter-react'
import { useAccount, useBalance, useConnect } from 'wagmi'
import { filecoin, filecoinCalibration } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import ExplorerLink from './explorer-link.jsx'

/**
 * Connect to the FEVM network.
 */
export default function ConnectFEVM() {
  const { account } = useFilsnap()
  const chainId =
    account?.config.network === 'mainnet' ? filecoin.id : filecoinCalibration.id
  const { address, isConnected, isConnecting } = useAccount()
  const { connect } = useConnect()
  const { data } = useBalance({
    chainId,
    address,
  })

  let out = (
    <button
      type="button"
      onClick={() =>
        connect({
          chainId,
          connector: injected(),
        })
      }
    >
      Connect to Filecoin EVM
    </button>
  )
  if (isConnected) {
    out = (
      <>
        <h3>FEVM Account</h3>
        <div>
          <b>
            {data?.formatted} {data?.symbol}
          </b>
        </div>
        <ExplorerLink address={address} chain="ethereum" />
        <ExplorerLink address={address} chain="filecoin" />
      </>
    )
  }

  if (isConnecting) {
    out = <div>Connecting...</div>
  }
  return (
    <div class={clsx('Cell75', 'Box', !isConnected && 'u-AlignCenter')}>
      {out}
    </div>
  )
}
