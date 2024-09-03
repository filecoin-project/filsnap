import { clsx } from 'clsx'
import { useFilsnap } from 'filsnap-adapter-react'
import { ToastContainer, toast } from 'react-toastify'

import ConnectAll from './components/connect-all.jsx'
import Forward from './components/forward.tsx'
import InstallMetamask from './components/install-mm.jsx'
import Links from './components/links.jsx'
import Network from './components/network.jsx'
import Account from './components/rpc.jsx'
import Send from './components/send.tsx'
import SignMessage from './components/sign-message.jsx'

/**
 * App component.
 */
export function App() {
  const { isLoading, isConnected, snap, provider, error } = useFilsnap()

  if (error) {
    console.error(error)
    toast.error(error.message, { toastId: error.message })
  }

  return (
    <main class="App">
      <h1>⨎ Filecoin Wallet</h1>
      <div class="Grid">
        {isLoading && (
          <div
            class={clsx(
              'Cell100',
              'Box',

              'u-AlignCenter'
            )}
          >
            <div>Loading...</div>
          </div>
        )}
        {!provider && !isLoading && <InstallMetamask />}
        {provider && !isLoading && (
          <>
            <Network />
            <ConnectAll />
          </>
        )}
        {isConnected && <Send />}
        {isConnected && <Forward />}
        {snap && (
          <>
            <details class="Cell100">
              <summary>Advanced</summary>
              <Account />
              <SignMessage />
            </details>
          </>
        )}
        <Links />
      </div>
      <ToastContainer theme="dark" position="bottom-right" />
    </main>
  )
}
