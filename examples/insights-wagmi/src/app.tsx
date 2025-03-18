import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, useAccount } from 'wagmi'

import { http, createConfig } from 'wagmi'
import { filecoin, filecoinCalibration } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'
import './App.css'
import { Account } from './account'
import { WalletOptions } from './wallet-options'

const queryClient = new QueryClient()

export const config = createConfig({
  chains: [filecoin, filecoinCalibration],
  connectors: [injected(), metaMask()],
  transports: {
    [filecoin.id]: http(),
    [filecoinCalibration.id]: http(),
  },
})

function ConnectWallet() {
  const { isConnected } = useAccount()
  if (isConnected) return <Account />
  return <WalletOptions />
}

function App() {
  return (
    <WagmiProvider config={config}>
      <h1>Filsnap Insights</h1>
      <QueryClientProvider client={queryClient}>
        <ConnectWallet />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
