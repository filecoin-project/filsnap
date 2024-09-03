import { clsx } from 'clsx'
import { useFilsnap } from 'filsnap-adapter-react'
import { Token } from 'iso-filecoin/token'
import { useAccount, useBalance } from 'wagmi'
import ExplorerLink from './explorer-link.jsx'

/**
 * @typedef {import('filsnap-adapter-react').} FilsnapContext
 */

/**
 * Connect to the network.
 */
export default function ConnectAll() {
  const {
    isConnected: isConnectedSnap,
    account,
    connect,
    disconnect,
    config,
  } = useFilsnap()
  const { isConnected: isConnectedWagmi, address } = useAccount()
  const { data } = useBalance({
    address,
  })

  const isConnected = isConnectedWagmi && isConnectedSnap

  let out = null

  if (!isConnected) {
    out = (
      <button
        type="button"
        data-testid="connect-snap"
        onClick={() => {
          connect()
        }}
      >
        Connect
      </button>
    )
  }

  if (isConnected) {
    out = (
      <>
        <h3>Native Account</h3>
        <div>
          <b>
            {account
              ? Token.fromAttoFIL(account.balance).toFIL().toFormat()
              : 'unknown'}{' '}
            {config.unit.symbol}
          </b>
        </div>
        <span data-testid="account-info">
          <ExplorerLink address={account.address} chain="filecoin" />
        </span>
        <br />
        <h3>FEVM Account</h3>
        <div>
          <b>
            {data?.formatted} {data?.symbol}
          </b>
        </div>
        <ExplorerLink address={address} chain="ethereum" />
        <ExplorerLink address={address} chain="filecoin" />
        <br />
        <button
          type="button"
          data-testid="connect-snap"
          onClick={() => {
            disconnect()
          }}
        >
          Disconnect
        </button>
      </>
    )
  }

  return (
    <div class={clsx('Cell100', 'Box', !isConnected && 'u-AlignCenter')}>
      {out}
    </div>
  )
}
