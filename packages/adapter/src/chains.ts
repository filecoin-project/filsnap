import { mainnet, testnet, toEthereumChain } from 'iso-filecoin/chains'

export const metamask = {
  mainnet: toEthereumChain(mainnet),
  testnet: toEthereumChain(testnet),
}

export { mainnet, testnet }
