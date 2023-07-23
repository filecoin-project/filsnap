import Account from './components/rpc.jsx'
import Connect from './components/connect.jsx'
import Network from './components/network.jsx'
import Send from './components/send.tsx'
import SignMessage from './components/sign-message.jsx'
import { useFilsnapContext } from './hooks/filsnap.js'
import ConnectFEVM from './components/connect-fevm.jsx'
import Forward from './components/forward.tsx'

export function App() {
  const { isConnected } = useFilsnapContext()

  return (
    <main class="App">
      <h1>⨎ Filsnap</h1>
      <div class="Grid">
        <Connect />
        <Network />
        {isConnected && (
          <>
            <Send />
            <ConnectFEVM />
            <Forward />
            <details class="Cell100">
              <summary>Advanced</summary>
              <Account />
              <SignMessage />
            </details>
          </>
        )}
        <div class="Cell100 Box">
          <h3>Links</h3>
          <ul>
            <li>
              {' '}
              Docs:{' '}
              <a
                target="_blank"
                href="https://filecoin-project.github.io/filsnap/"
                rel="noreferrer"
              >
                filecoin-project.github.io/filsnap
              </a>
            </li>
            <li>
              {' '}
              Github:{' '}
              <a
                target="_blank"
                href="https://github.com/filecoin-project/filsnap"
                rel="noreferrer"
              >
                github.com/filecoin-project/filsnap
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
