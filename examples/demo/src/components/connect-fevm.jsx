import { clsx } from 'clsx'
import { useAccount, useBalance, useConnect } from 'wagmi'
import { filecoin, filecoinCalibration } from 'wagmi/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { useFilsnap } from 'filsnap-adapter-react'
import ExplorerLink from './explorer-link.jsx'

/**
 * Connect to the FEVM network.
 */
export default function ConnectFEVM() {
  const { account } = useFilsnap()
  const { address, isConnected, isConnecting } = useAccount()
  const { connect } = useConnect({
    chainId:
      account?.config.network === 'mainnet'
        ? filecoin.id
        : filecoinCalibration.id,
    connector: new MetaMaskConnector({
      chains: [filecoinCalibration, filecoin],
    }),
  })

  const { data } = useBalance({
    chainId:
      account?.config.network === 'mainnet'
        ? filecoin.id
        : filecoinCalibration.id,
    address,
    formatUnits: 'ether',
  })

  let out = <button onClick={() => connect()}>Connect to Filecoin EVM</button>
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
