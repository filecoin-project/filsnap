/* eslint-disable unicorn/no-useless-undefined */
import { enableFilecoinSnap } from 'filsnap-adapter'
import { useState } from 'preact/hooks'

import Account from './components/Account'
import SignMessage from './components/SignMessage'

export function App() {
  const [error, setError] = useState(
    /** @type {Error | undefined} */ (undefined)
  )
  const [output, setOutput] = useState(
    /** @type {any | undefined} */ (undefined)
  )
  const [api, setApi] = useState(
    /** @type {any | undefined} */ (undefined)
  )
  return (
    <main class="App">
      <h1>Filsnap Testing</h1>
      <div class="Grid Space-below">
        <div class="Box">
          <span class="Box-text">
            <button
              data-testid="enable-snap"
              onClick={() => {
                enableFilecoinSnap(
                  { network: 'testnet' },
                  'local:http://localhost:8081'
                )
                  .then(async (snap) => {
                    setOutput(snap)
                    const snapApi = await snap.getFilecoinSnapApi()
                    setApi(snapApi)
                  })
                  .catch((error_) => {
                    setError(error_)
                  })
              }}
            >
              Enable Snap
            </button>
          </span>
        </div>
        <div class="Box">
          <span class="Box-text">
            <code data-testid="error">{error ? error.message : ''}</code>
          </span>
        </div>
        <div class="Box">
          <span class="Box-text">
            <code data-testid="output">{JSON.stringify(output)}</code>
          </span>
        </div>
      </div>
      {api && (
        <>
          <Account api={api} />
          <SignMessage api={api} />
        </>
      )}
    </main>
  )
}
