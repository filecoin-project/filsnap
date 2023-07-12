/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { useFilsnapContext } from '../hooks/filsnap.js'
import { Token } from 'iso-filecoin/token'

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
      <span data-testid="install-mm-flask">
        Install Metamask{' '}
        <a
          href="https://chrome.google.com/webstore/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk"
          target="_blank"
          rel="noreferrer"
        >
          Flask
        </a>
      </span>
    )
  }

  if (isConnected) {
    out = (
      <>
        <h3 title={account.balance + ' attoFIL'}>
          <b>
            {account
              ? Token.fromAttoFIL(account.balance).toFIL().toFormat(6)
              : 'unknown'}{' '}
            FIL
          </b>
        </h3>
        <span data-testid="account-info">
          Connected to{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://explorer.glif.io/address/${
              account.address
            }/?network=${
              account?.config.network === 'mainnet'
                ? 'mainnet'
                : 'calibrationnet'
            }`}
          >
            {account ? account.address : 'unknown'}
          </a>{' '}
        </span>
      </>
    )
  }

  if (isLoading) {
    out = <span>Loading...</span>
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
  return <div class="Cell75 Box">{out}</div>
}
