/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { useFilsnapContext } from '../hooks/filsnap.js'
import { Token } from 'iso-filecoin/token'
import { clsx } from 'clsx'
import ExplorerLink from './explorer-link.jsx'

export default function Connect() {
  const { isLoading, hasFlask, isConnected, connect, account, error } =
    useFilsnapContext()

  let out = null

  if (!isConnected) {
    out = (
      <button data-testid="connect-snap" onClick={() => connect()}>
        Connect Filecoin Snap
      </button>
    )
  }

  if (!hasFlask) {
    out = (
      <div data-testid="install-mm-flask">
        Install Metamask{' '}
        <a
          href="https://chrome.google.com/webstore/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk"
          target="_blank"
          rel="noreferrer"
        >
          Flask
        </a>
      </div>
    )
  }

  if (isConnected) {
    out = (
      <>
        <h3>Native Account</h3>
        <div title={account.balance + ' attoFIL'}>
          <b>
            {account
              ? Token.fromAttoFIL(account.balance).toFIL().toFormat(18)
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

  if (error) {
    out = (
      <>
        <h3>
          Error <br />
        </h3>
        <p>{error.message}</p>
      </>
    )
  }
  return (
    <div class={clsx('Cell75', 'Box', !isConnected && 'u-AlignCenter')}>
      {out}
    </div>
  )
}
