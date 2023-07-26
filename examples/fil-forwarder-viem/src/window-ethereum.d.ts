import type { EthereumProvider } from 'viem'

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}
