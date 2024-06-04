/* eslint-disable unicorn/no-useless-undefined */
import { FilsnapAdapter } from 'filsnap-adapter'
import * as React from 'react'

/**
 * @typedef {import('./types.js').FilsnapProviderProps} FilsnapProviderProps
 */

const FilsnapContext =
  /** @type {typeof React.createContext<import('./types.js').FilsnapContext>} */ (
    React.createContext
  )({
    isLoading: true,
    isConnected: false,
    hasFlask: false,
    error: undefined,
    snap: undefined,
    connect: () => Promise.resolve(),
    account: undefined,
    setSnapConfig: () => {
      // noop
    },
  })

/**
 *
 * @param {import('./types.js').FilsnapProviderProps & {children : React.ReactNode}} props
 * @returns {React.FunctionComponentElement<React.ProviderProps<import('./types.js').FilsnapContext>>}
 */
export function FilsnapProvider({ snapId, snapVersion, config, children }) {
  // State
  const [error, setError] = /** @type {typeof React.useState<Error>} */ (
    React.useState
  )()
  const [snap, setSnap] = /** @type {typeof React.useState<FilsnapAdapter>} */ (
    React.useState
  )()
  const [account, setAccount] = React.useState(
    /** @type {import('filsnap-adapter').AccountInfo | undefined | null} */ (
      undefined
    )
  )
  const [isConnected, setIsConnected] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasFlask, setHasFlask] = React.useState(false)
  const [snapConfig, setSnapConfig] =
    /** @type {typeof React.useState<Partial<import('filsnap-adapter').SnapConfig>>} */ (
      React.useState
    )(config)

  // Effects
  React.useEffect(() => {
    setIsConnected(false)
  }, [])

  React.useEffect(() => {
    let mounted = true
    /**
     * Setup the adapter
     */
    async function setup() {
      if (mounted) {
        setError(undefined)
        try {
          const hasFlask = await FilsnapAdapter.hasSnaps()
          setHasFlask(hasFlask)
        } catch (error) {
          const err = /** @type {Error} */ (error)
          setError(err)
        } finally {
          setIsLoading(false)
        }
      }
    }

    setIsLoading(true)
    setup()

    return () => {
      mounted = false
    }
  }, [setError])

  // Callbacks
  const connect = React.useCallback(
    async (
      /** @type {Partial<import('filsnap-adapter').SnapConfig> | undefined} */ _config = snapConfig
    ) => {
      setIsLoading(true)
      setError(undefined)
      try {
        const snap = await FilsnapAdapter.connect(_config, snapId, snapVersion)
        const account = await snap.getAccountInfo()
        if (account.error) {
          setError(new Error(account.error.message, { cause: account.error }))
        }

        setSnap(snap)
        setAccount(account.result)
        setIsConnected(true)
      } catch (error) {
        const err = /** @type {Error} */ (error)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    },
    [snapConfig, snapId, snapVersion, setSnap, setError]
  )

  /** @type {import('./types.js').FilsnapContext} */
  const value = React.useMemo(() => {
    if (isLoading) {
      return {
        isLoading: true,
        isConnected: false,
        hasFlask: false,
        error: undefined,
        snap: undefined,
        account: undefined,
        connect,
        setSnapConfig,
      }
    }
    if (!hasFlask) {
      return {
        isLoading: false,
        isConnected: false,
        hasFlask: false,
        error: undefined,
        snap: undefined,
        account: undefined,
        connect,
        setSnapConfig,
      }
    }

    if (hasFlask && !isConnected) {
      return {
        isLoading: false,
        isConnected: false,
        hasFlask: true,
        error,
        snap: undefined,
        account: undefined,
        connect,
        setSnapConfig,
      }
    }

    if (hasFlask && !isConnected && error) {
      return {
        isLoading: false,
        isConnected: false,
        hasFlask: true,
        error,
        snap: undefined,
        account: undefined,
        connect,
        setSnapConfig,
      }
    }

    if (error) {
      return {
        isLoading: false,
        isConnected: false,
        hasFlask: false,
        error,
        snap: undefined,
        account: undefined,
        connect,
        setSnapConfig,
      }
    }

    if (!snap || !account) {
      return {
        isLoading: false,
        isConnected: false,
        hasFlask,
        error,
        snap: undefined,
        account: undefined,
        connect,
        setSnapConfig,
      }
    }

    return {
      isLoading,
      isConnected: true,
      hasFlask: true,
      error,
      snap,
      account,
      connect,
      setSnapConfig,
    }
  }, [
    account,
    connect,
    error,
    hasFlask,
    isConnected,
    isLoading,
    snap,
    setSnapConfig,
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
