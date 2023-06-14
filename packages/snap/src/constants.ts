import type { MetamaskState } from './schemas.js'
import type { SnapConfig } from './types.js'

export const mainnetConfig: SnapConfig = {
  derivationPath: "m/44'/461'/0'/0/0",
  network: 'f',
  rpc: {
    token: '',
    url: 'https://api.node.glif.io',
  },
  unit: {
    decimals: 6,
    image: `https://cryptologos.cc/logos/filecoin-fil-logo.svg?v=007`,
    symbol: 'FIL',
  },
}

// devnet configuration replaces testnet for now
export const testnetConfig: SnapConfig = {
  derivationPath: "m/44'/1'/0'/0/0",
  network: 't',
  rpc: {
    token: '',
    url: `https://api.calibration.node.glif.io`,
  },
  unit: {
    decimals: 6,
    image: `https://cryptologos.cc/logos/filecoin-fil-logo.svg?v=007`,
    symbol: 'FIL',
    // custom view url ?
  },
}

export const initialState: MetamaskState = {
  filecoin: {
    config: mainnetConfig,
    messages: [],
  },
}
