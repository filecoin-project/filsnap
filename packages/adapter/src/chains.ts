export const metamask = {
  mainnet: {
    chainId: '0x13a',
    chainName: 'Filecoin - Mainnet',
    rpcUrls: ['https://api.node.glif.io/rpc/v1'],
    blockExplorerUrls: ['https://filfox.info', 'https://explorer.glif.io/'],
    nativeCurrency: {
      name: 'Filecoin',
      symbol: 'FIL',
      decimals: 18,
    },
    iconUrls: ['https://filsnap.dev/filecoin-logo.svg'],
  },

  testnet: {
    chainId: '0x4cb2f',
    chainName: 'Filecoin - Calibration testnet',
    rpcUrls: ['https://api.calibration.node.glif.io/rpc/v1'],
    blockExplorerUrls: ['https://filfox.info', 'https://explorer.glif.io/'],
    nativeCurrency: {
      name: 'Filecoin',
      symbol: 'tFIL',
      decimals: 18,
    },
    iconUrls: ['https://filsnap.dev/filecoin-logo.svg'],
  },
}
