import { http, createConfig } from 'wagmi'
import { filecoin, filecoinCalibration } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const configWagmi = createConfig({
  chains: [filecoin, filecoinCalibration],
  transports: {
    [filecoin.id]: http(),
    [filecoinCalibration.id]: http(),
  },
  connectors: [injected()],
})
