import { render } from 'preact'
import { App } from './app.jsx'
import './styles/index.css'
import { FilsnapContextProvider } from './hooks/filsnap.js'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { filecoinCalibration, filecoin } from 'wagmi/chains'
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

/** @type {Partial<import('filsnap-adapter').SnapConfig>} */
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
      <FilsnapContextProvider snapId={SNAP_ID} config={config}>
        <App />
      </FilsnapContextProvider>
    </WagmiConfig>,
    appEl
  )
}
