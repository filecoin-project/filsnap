import type {
  AccountInfo,
  EIP1193Provider,
  FilsnapAdapter,
  SnapConfig,
} from 'filsnap-adapter'

export interface FilsnapProviderProps {
  snapId: string
  /**
   * Don't specify this option, unless you know what you're doing and are trying to pin your adapter to a specific snap version
   * @default MIN_SNAP_VERSION - Minimum supported snap version
   */
  snapVersion?: string
  /**
   * Snap config
   */
  config: Partial<SnapConfig>
  /**
   * Whether to reconnect to previously connected snap on mount
   */
  reconnectOnMount?: boolean
  /**
   * Sync the snap config with the provider
   */
  syncWithProvider?: boolean
}

export type ConnectFnOptions = {
  config?: Partial<SnapConfig>
  onSuccess?: (data: AccountInfo) => void
  onError?: (error: Error) => void
  onSettled?: (data?: AccountInfo, error?: Error) => void
}

export type ConfigureFnOptions = {
  config: Partial<SnapConfig>
  onSuccess?: (data: Partial<SnapConfig>) => void
  onError?: (error: Error) => void
  onSettled?: (data?: Partial<SnapConfig>, error?: Error) => void
}

export type ConnectFn = (options?: ConnectFnOptions) => Promise<void>
export type ConfigureFn = (options: ConfigureFnOptions) => Promise<void>
export type SetSnapConfig = React.Dispatch<
  React.SetStateAction<Partial<SnapConfig>>
>
export type FilsnapContext = {
  /**
   * Initial load for provider and auto reconnect
   */
  isLoading: boolean
  isConnecting: boolean
  isConfiguring: boolean
  isPending: boolean
  /**
   * Snap is connected
   */
  isConnected: boolean
  snap?: FilsnapAdapter
  account?: AccountInfo | null
  error?: Error
  config: Partial<SnapConfig>
  provider?: EIP1193Provider
  connect: ConnectFn
  configure: ConfigureFn
  disconnect: () => Promise<void>
}
