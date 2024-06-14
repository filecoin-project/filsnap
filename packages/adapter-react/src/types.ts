import type { AccountInfo, FilsnapAdapter, SnapConfig } from 'filsnap-adapter'

export interface FilsnapProviderProps {
  snapId: string
  snapVersion?: string
  config: Partial<SnapConfig>
}

export type ConnectFn = (config?: Partial<SnapConfig>) => Promise<void>
export type SetSnapConfig = React.Dispatch<
  React.SetStateAction<Partial<SnapConfig>>
>
export type FilsnapContext =
  // Initial state
  | {
      isLoading: true
      isConnected: false
      hasSnaps: false
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
      hasSnaps: false
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
      hasSnaps: true
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
      hasSnaps: true
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
      hasSnaps: false
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
      hasSnaps: true
      snap: FilsnapAdapter
      account: AccountInfo
      error: undefined
      connect: ConnectFn
      setSnapConfig: SetSnapConfig
    }
