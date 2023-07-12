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
      <h1>⨎ Filsnap </h1>
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
      </div>
    </main>
  )
}
