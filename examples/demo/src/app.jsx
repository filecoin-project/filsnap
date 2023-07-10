/* eslint-disable unicorn/no-useless-undefined */
import Account from './components/account.jsx'
import Network from './components/network.jsx'
import SignMessage from './components/sign-message.jsx'
import Connect from './components/connect.jsx'

export function App() {
  return (
    <main class="App">
      <h1>⨎ Filsnap </h1>
      <div class="Grid">
        <Connect />
        <Network />
        <Account />
        <SignMessage />
      </div>
    </main>
  )
}
