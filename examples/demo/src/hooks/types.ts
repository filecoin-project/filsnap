import type { FilsnapAdapter, SnapConfig, AccountInfo } from 'filsnap-adapter'
import type { StateUpdater } from 'preact/hooks'

export interface FilsnapContextProviderProps {
  snapId: string
  snapVersion?: string
  config: Partial<SnapConfig>
}

export type ConnectFn = (config?: Partial<SnapConfig>) => Promise<void>
export type SetSnapConfig = StateUpdater<Partial<SnapConfig>>
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
      setSnapConfig: SetSnapConfig
    }
  // Flask is not installed
  | {
      isLoading: false
      isConnected: false
      hasFlask: false
      snap: undefined
      account: undefined
      error: undefined
      connect: ConnectFn
      setSnapConfig: SetSnapConfig
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
      setSnapConfig: SetSnapConfig
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
      setSnapConfig: SetSnapConfig
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
      setSnapConfig: SetSnapConfig
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
      setSnapConfig: SetSnapConfig
    }
