import type { SnapConfig } from './types.ts'

export const SNAP_ID =
  process.env.SNAP_ENV === 'test'
    ? 'local:http://localhost:8080'
    : 'npm:filsnap'
export const INTERNAL_CONFIG = '__INTERNAL_CONFIG__'
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
  derivationMode: 'native',
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
  derivationMode: 'native',
}
