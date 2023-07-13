import { render } from 'preact'
import { App } from './app.jsx'
import './styles/index.css'
import { FilsnapContextProvider } from './hooks/filsnap.js'

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
    <FilsnapContextProvider snapId={SNAP_ID} config={config}>
      <App />
    </FilsnapContextProvider>,
    appEl
  )
}
