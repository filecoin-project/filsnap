import { clsx } from 'clsx'
import { useFilsnap } from 'filsnap-adapter-react'
import { Token } from 'iso-filecoin/token'
import { toast } from 'react-toastify'
import ExplorerLink from './explorer-link.jsx'

/**
 * Connect to the network.
 */
export default function Connect() {
  const { isLoading, hasSnaps, isConnected, connect, account, error } =
    useFilsnap()

  if (error) {
    toast.error(error.message)
  }

  let out = null

  if (!isConnected) {
    out = (
      <button
        type="button"
        data-testid="connect-snap"
        onClick={() => connect()}
      >
        Connect
      </button>
    )
  }

  if (!hasSnaps) {
    out = (
      <div data-testid="install-mm-flask">
        Install{' '}
        <a
          href="https://chromewebstore.google.com/detail/nkbihfbeogaeaoehlefnkodbefgpgknn"
          target="_blank"
          rel="noreferrer"
        >
          Metamask
        </a>
      </div>
    )
  }

  if (isConnected) {
    out = (
      <>
        <h3>Native Account</h3>
        <div title={`${account.balance} attoFIL`}>
          <b>
            {account
              ? Token.fromAttoFIL(account.balance).toFIL().toFormat()
              : 'unknown'}{' '}
            FIL
          </b>
        </div>
        <span data-testid="account-info">
          <ExplorerLink address={account.address} chain="filecoin" />
        </span>
      </>
    )
  }

  if (isLoading) {
    out = <div>Loading...</div>
  }

  return (
    <div class={clsx('Cell75', 'Box', !isConnected && 'u-AlignCenter')}>
      {out}
    </div>
  )
}
