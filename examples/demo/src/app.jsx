import Account from './components/rpc.jsx'
import Connect from './components/connect.jsx'
import Network from './components/network.jsx'
import Send from './components/send.tsx'
import SignMessage from './components/sign-message.jsx'
import { useFilsnapContext } from './hooks/filsnap.js'

export function App() {
  const { isConnected } = useFilsnapContext()

  return (
    <main class="App">
      <h1>⨎ Filsnap</h1>
      <div class="Grid">
        <Connect />
        {isConnected && (
          <>
            <Network />
            <Send />
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
              <a href="https://filecoin-project.github.io/filsnap/">
                filecoin-project.github.io/filsnap
              </a>
            </li>
            <li>
              {' '}
              Github:{' '}
              <a href="https://github.com/filecoin-project/filsnap">
                github.com/filecoin-project/filsnap
              </a>
            </li>
          </ul>
          <br />
        </div>
      </div>
    </main>
  )
}
