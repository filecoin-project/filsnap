import type { FilsnapAdapter, SnapConfig, AccountInfo } from 'filsnap-adapter'

export interface FilsnapContextProviderProps {
  snapId: string
  snapVersion?: string
  config: Partial<SnapConfig>
}

export type ConnectFn = (config?: Partial<SnapConfig>) => Promise<void>
export type FilsnapContext =
  // Initial state
  | {
      isLoading: true
      isConnected: false
      hasFlask: false
      snap: undefined
      account: undefined
      error: undefined
      connect: ConnectFn
    }
  // Flask is installed
  | {
      isLoading: false
      isConnected: false
      hasFlask: true
      snap: undefined
      account: undefined
      error: undefined
      connect: ConnectFn
    }
  // Flask is installed but not connected to snap with error
  | {
      isLoading: false
      isConnected: false
      hasFlask: true
      snap: undefined
      account: undefined
      error: Error
      connect: ConnectFn
    }
  // Just Error
  | {
      isLoading: false
      isConnected: false
      hasFlask: false
      snap: undefined
      account: undefined
      error: Error
      connect: ConnectFn
    }
  // Flask is installed and connected
  | {
      isLoading: false
      isConnected: true
      hasFlask: true
      snap: FilsnapAdapter
      account: AccountInfo
      error: undefined
      connect: ConnectFn
    }
