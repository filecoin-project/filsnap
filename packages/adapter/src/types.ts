import type { MetamaskFilecoinRpcRequest } from 'filsnap/src/types'

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean
      isUnlocked: Promise<boolean>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      request: <T>(
        request: MetamaskFilecoinRpcRequest | { method: string; params?: any }
      ) => Promise<T>
      on: (eventName: unknown, callback: unknown) => unknown
    }
  }
}
