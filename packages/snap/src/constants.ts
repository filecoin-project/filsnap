import type { SnapConfig } from './types'

export const mainnetConfig: SnapConfig = {
  derivationPath: "m/44'/461'/0'/0/0",
  network: 'mainnet',
  rpc: {
    token: '',
    url: 'https://api.node.glif.io',
  },
  unit: {
    decimals: 18,
    symbol: 'FIL',
  },
}

export const testnetConfig: SnapConfig = {
  derivationPath: "m/44'/1'/0'/0/0",
  network: 'testnet',
  rpc: {
    token: '',
    url: 'https://api.calibration.node.glif.io',
  },
  unit: {
    decimals: 18,
    symbol: 'tFIL',
  },
}
