import { render } from 'preact'
import { App } from './app.jsx'
import './styles/index.css'
import { OddContextProvider } from './hooks/filsnap.js'

/** @type {Partial<import('filsnap-adapter').SnapConfig>} */
const config = {
  network: 'testnet',
}

// eslint-disable-next-line unicorn/prefer-query-selector
const appEl = document.getElementById('app')

if (appEl) {
  render(
    <OddContextProvider snapId="local:http://localhost:8081" config={config}>
      <App />
    </OddContextProvider>,
    appEl
  )
}
