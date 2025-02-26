import {
  FilsnapAdapter,
  chainIdtoNetwork,
  createConnector,
  getProvider,
} from 'filsnap-adapter'
import * as React from 'react'

/**
 * @typedef {import('./types.js').FilsnapContext} FilsnapContext
 * @typedef {import('./types.js').FilsnapProviderProps} FilsnapProviderProps
 */

/**
 * @import {ConfigureFn, ConnectFn, FilsnapContext, FilsnapProviderProps} from './types.js'
 * @import {SnapConfig, AccountInfo, EIP1193Provider} from 'filsnap-adapter'
 */

/**
 * Filsnap React Context
 */
const FilsnapContext =
  /** @type {typeof React.createContext<FilsnapContext>} */ (
    React.createContext
  )({
    config: {},
    isLoading: true,
    isConfiguring: false,
    isConnecting: false,
    isPending: false,
    isConnected: false,
    error: undefined,
    snap: undefined,
    account: undefined,
    provider: undefined,
    connect: () => Promise.resolve(),
    configure: () => Promise.resolve(),
    disconnect: () => Promise.resolve(),
  })

/**
 *
 * @param {React.PropsWithChildren<FilsnapProviderProps>} props
 */
export function FilsnapProvider({
  snapId,
  snapVersion,
  config,
  children,
  reconnectOnMount = true,
  syncWithProvider = true,
}) {
  // State
  const [error, setError] = /** @type {typeof React.useState<Error>} */ (
    React.useState
  )()
  const [isLoading, setIsLoading] = React.useState(true)
  const [isConnecting, setIsConnecting] = React.useState(false)
  const [isConfiguring, setIsConfiguring] = React.useState(false)

  const [snap, setSnap] = /** @type {typeof React.useState<FilsnapAdapter>} */ (
    React.useState
  )()
  const [account, setAccount] = React.useState(
    /** @type {AccountInfo | undefined | null} */ (undefined)
  )
  const [snapConfig, setSnapConfig] =
    /** @type {typeof React.useState<Partial<SnapConfig>>} */ (React.useState)(
      config
    )

  const [provider, setProvider] =
    /** @type {typeof React.useState<EIP1193Provider|undefined>} */ (
      React.useState
    )(undefined)
  const [connector, setConnector] =
    /** @type {typeof React.useState<ReturnType<createConnector>|undefined>} */ (
      React.useState
    )(undefined)

  React.useEffect(() => {
    let mounted = true
    /**
     * Setup the adapter
     */
    async function setup() {
      setError(undefined)
      try {
        const provider = await getProvider()
        const connector = createConnector({
          provider,
        })

        if (mounted) {
          setConnector(connector)
          setProvider(provider)
        }

        // Reconnect on mount
        if (reconnectOnMount) {
          const data = await FilsnapAdapter.reconnect({
            snapId,
            snapVersion,
            provider,
          })

          if (data) {
            if (data && mounted) {
              setSnap(data.adapter)
              setAccount(data.account)
              setSnapConfig(data.account.config)
              if (syncWithProvider) {
                await connector.connect({
                  network: data.account.config.network,
                })
              }
            }
          }
        }
      } catch (error) {
        const err = /** @type {Error} */ (error)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    setIsLoading(true)
    setup()

    return () => {
      mounted = false
    }
  }, [
    snapId,
    snapVersion,
    reconnectOnMount,
    syncWithProvider,
    setError,
    setSnap,
    setProvider,
    setSnapConfig,
    setConnector,
  ])

  /**
   * Handle chain changes effect
   */
  React.useEffect(() => {
    /**
     * Handle chain changes
     *
     * @param {string} chainId
     */
    async function onChainChange(chainId) {
      if (snap) {
        try {
          const network = chainIdtoNetwork(chainId)

          if (network === snapConfig.network) {
            return
          }

          if (network === undefined) {
            return await disconnect()
          }

          setIsConfiguring(true)

          const data = await snap.changeChain(chainId)

          if (data.error) {
            return setError(
              new Error(data.error.message, { cause: data.error })
            )
          }
          const account = await snap.getAccountInfo()
          if (account.error) {
            return setError(
              new Error(account.error.message, { cause: account.error })
            )
          }

          setSnapConfig(data.result)
          setAccount(account.result)
        } catch (error) {
          const err = /** @type {Error} */ (error)
          setError(err)
        } finally {
          setIsConfiguring(false)
        }
      }
    }

    /**
     * @param {any[]} accounts
     */
    function onAccountsChanged(accounts) {
      if (accounts.length === 0) {
        // Disconnected
        setError(undefined)
        setSnap(undefined)
        setAccount(undefined)
        if (provider) {
          provider.removeListener('chainChanged', onChainChange)
          provider.removeListener('accountsChanged', onAccountsChanged)
        }
      }
    }

    if (provider) {
      provider.on('chainChanged', onChainChange)
      provider.on('accountsChanged', onAccountsChanged)
    }

    return () => {
      if (provider) {
        provider.removeListener('chainChanged', onChainChange)
        provider.removeListener('accountsChanged', onAccountsChanged)
      }
    }
  }, [provider, snap, snapConfig, setError, setSnapConfig, setSnap])

  // Callbacks
  /**
   * Connect to the snap
   * @type {ConnectFn}
   */
  const connect = React.useCallback(
    async (options = {}) => {
      const { config } = {
        config: snapConfig,
        ...options,
      }

      const onError = (/** @type {Error} */ err) => {
        setError(err)
        options.onError?.(err)
        options.onSettled?.(undefined, err)
        setIsConnecting(false)
      }
      const onSuccess = (/** @type {AccountInfo} */ account) => {
        options.onSuccess?.(account)
        options.onSettled?.(account)
        setIsConnecting(false)
      }

      setIsConnecting(true)

      try {
        if (!provider) {
          return onError(new Error('Provider not found'))
        }

        const adapter = await FilsnapAdapter.connect({
          config,
          snapId,
          snapVersion,
          provider,
        })
        const account = await adapter.getAccountInfo()
        if (account.error) {
          return onError(
            new Error(account.error.message, { cause: account.error })
          )
        }
        if (syncWithProvider && connector) {
          await connector.connect({
            network: account.result?.config.network,
          })
        }

        setSnap(adapter)
        setAccount(account.result)
        setSnapConfig(account.result?.config)
        onSuccess(account.result)
      } catch (error) {
        const err = /** @type {Error} */ (error)
        onError(err)
      }
    },
    [
      snapId,
      snapVersion,
      snapConfig,
      provider,
      connector,
      syncWithProvider,
      setError,
      setSnap,
      setSnapConfig,
    ]
  )
  /**
   * Configure the snap
   * @type {ConfigureFn}
   */
  const configure = React.useCallback(
    async (options) => {
      const { config } = {
        ...options,
      }

      setIsConfiguring(true)
      const onError = (/** @type {Error} */ err) => {
        setError(err)
        options.onError?.(err)
        options.onSettled?.(undefined, err)
        setIsConfiguring(false)
      }
      const onSuccess = (/** @type {Partial<SnapConfig>} */ config) => {
        options.onSuccess?.(config)
        options.onSettled?.(config)
        setIsConfiguring(false)
      }

      try {
        if (snap) {
          const configure = await snap.configure(config)
          if (configure.error) {
            onError(
              new Error(configure.error.message, { cause: configure.error })
            )
            return
          }
          const account = await snap.getAccountInfo()
          if (account.error) {
            onError(new Error(account.error.message, { cause: account.error }))
            return
          }

          if (syncWithProvider && connector) {
            await connector.switchChain(configure.result.network)
          }

          setAccount(account.result)
          setSnapConfig(configure.result)
          onSuccess(configure.result)
        } else {
          setSnapConfig(config)
          if (syncWithProvider && connector) {
            await connector.switchChain(config.network)
          }
          onSuccess(config)
        }
      } catch (error) {
        const err = /** @type {Error} */ (error)
        onError(err)
        return
      }
    },
    [snap, syncWithProvider, connector, setSnapConfig, setError]
  )

  /**
   * Disconnect from the snap
   */
  const disconnect = React.useCallback(async () => {
    if (snap) {
      await snap.disconnect()
    }
    if (syncWithProvider && connector) {
      await connector.disconnect()
    }

    setError(undefined)
    setSnap(undefined)
    setAccount(undefined)
  }, [snap, syncWithProvider, connector, setError, setSnap])

  /** @type {import('./types.js').FilsnapContext} */
  const value = React.useMemo(() => {
    return {
      isLoading,
      isConfiguring,
      isConnecting,
      isPending: isConnecting || isConfiguring || isLoading,
      isConnected: snap != null,
      error,
      snap,
      account,
      config: snapConfig,
      provider,
      connect,
      configure,
      disconnect,
    }
  }, [
    isLoading,
    isConfiguring,
    isConnecting,
    error,
    snap,
    account,
    snapConfig,
    provider,
    connect,
    configure,
    disconnect,
  ])

  return React.createElement(FilsnapContext.Provider, { value }, children)
}

/**
 * Filsnap React Hook
 */
export function useFilsnap() {
  const context = React.useContext(FilsnapContext)
  if (!context) {
    throw new Error('useFilsnap must be used within a FilsnapProvider.')
  }

  return context
}
