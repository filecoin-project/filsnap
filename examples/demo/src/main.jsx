import { render } from 'preact'
import { App } from './app.jsx'
import './styles/index.css'

import { FilsnapProvider } from 'filsnap-adapter-react'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { filecoin, filecoinCalibration } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const { publicClient, webSocketPublicClient } = configureChains(
  [filecoinCalibration, filecoin],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.rpcUrls.default.http[0],
      }),
    }),
  ]
)

const configWagmi = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

/** @type {Partial<import('filsnap-adapter-react').FilsnapProviderProps['config']>} */
const config = {
  network: 'testnet',
}
const SNAP_ID = import.meta.env.DEV
  ? 'local:http://localhost:8081'
  : 'npm:filsnap'

// eslint-disable-next-line unicorn/prefer-query-selector
const appEl = document.getElementById('app')

if (appEl) {
  render(
    <WagmiConfig config={configWagmi}>
      <FilsnapProvider snapId={SNAP_ID} config={config}>
        <App />
      </FilsnapProvider>
    </WagmiConfig>,
    appEl
  )
}
