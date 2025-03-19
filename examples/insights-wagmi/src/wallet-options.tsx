import { type EIP1193Provider, syncWithProvider } from 'filsnap-adapter'
import * as React from 'react'
import { type Connector, useConnect } from 'wagmi'

export function WalletOptions() {
  const { connectors, connect } = useConnect()

  return connectors.map((connector) => (
    <WalletOption
      key={connector.uid}
      connector={connector}
      onClick={async () => {
        // Without reconnect on mount you can sync on connect and use connector provider directly
        const provider = (await connector.getProvider()) as EIP1193Provider
        if (provider.isMetaMask) {
          syncWithProvider({
            provider,
            reconnect: false,
            version: '1.5.3',
          })
        }
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
      setReady(!!provider)
    })()
  }, [connector])

  return (
    <button type="button" disabled={!ready} onClick={onClick}>
      {connector.name}
    </button>
  )
}
