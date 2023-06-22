/* eslint-disable unicorn/no-useless-undefined */
import { enableFilecoinSnap } from 'filsnap-adapter'
import { useState } from 'preact/hooks'

export function App() {
  const [error, setError] = useState(
    /** @type {Error | undefined} */ (undefined)
  )
  const [output, setOutput] = useState(
    /** @type {any | undefined} */ (undefined)
  )
  return (
    <main class="App">
      <h1>Filsnap Testing</h1>
      <div class="Grid">
        <div class="Box">
          <span class="Box-text">
            <button
              data-testid="enable-snap"
              onClick={() => {
                enableFilecoinSnap({ network: 't' }, 'npm:filsnap')
                  .then((snap) => {
                    setOutput(snap)
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
    </main>
  )
}
