import type { EIP1193Provider } from 'filsnap-adapter'
import { syncProvider } from 'filsnap-adapter'
import * as React from 'react'
import { type Connector, useConnect } from 'wagmi'

export function WalletOptions() {
  const { connectors, connect } = useConnect()

  return connectors.map((connector) => (
    <WalletOption
      key={connector.uid}
      connector={connector}
      onClick={() => {
        connect({ connector })
      }}
    />
  ))
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector
  onClick: () => void
}) {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    ;(async () => {
      const provider = await connector.getProvider()
      syncProvider(provider as EIP1193Provider)
      setReady(!!provider)
    })()
  }, [connector])

  return (
    <button type="button" disabled={!ready} onClick={onClick}>
      {connector.name}
    </button>
  )
}
