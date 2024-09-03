import { http, createConfig } from 'wagmi'
import { filecoin, filecoinCalibration } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const configWagmi = createConfig({
  chains: [filecoinCalibration, filecoin],
  transports: {
    [filecoinCalibration.id]: http(),
    [filecoin.id]: http(),
  },
  connectors: [injected()],
})
