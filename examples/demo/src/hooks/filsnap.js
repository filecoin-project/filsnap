/* eslint-disable unicorn/no-useless-undefined */
import { FilsnapAdapter } from 'filsnap-adapter'
import { createContext, createElement } from 'preact'
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks'

/** @type {import('preact').Context<import('./types.js').FilsnapContext>} */
// @ts-ignore
const FilsnapContext = createContext({
  isLoading: true,
  isConnected: false,
  hasFlask: false,
  error: undefined,
  snap: undefined,
  connect: () => Promise.resolve(),
})

/**
 *
 * @param {import('./types.js').FilsnapContextProviderProps & {children : import('preact').ComponentChildren}} props
 * @returns
 */
export function FilsnapContextProvider({
  snapId,
  snapVersion,
  config,
  children,
}) {
  // State
  const [error, setError] = /** @type {typeof useState<Error>} */ (useState)()
  const [snap, setSnap] = /** @type {typeof useState<FilsnapAdapter>} */ (
    useState
  )()
  const [account, setAccount] = useState(
    /** @type {import('filsnap-adapter').AccountInfo | undefined | null} */ (
      undefined
    )
  )
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasFlask, setHasFlask] = useState(false)
  const [snapConfig, setSnapConfig] =
    /** @type {typeof useState<Partial<import('filsnap-adapter').SnapConfig>>} */ (
      useState
    )(config)

  // Effects
  useEffect(() => {
    let mounted = true
    async function setup() {
      if (mounted) {
        setError(undefined)
        try {
          const hasFlask = await FilsnapAdapter.hasFlask()
          const isConnected = await FilsnapAdapter.isConnected(snapId)
          if (hasFlask && isConnected) {
            const snap = await FilsnapAdapter.create(snapConfig, snapId)
            const account = await snap.getAccountInfo()
            if (account.error) {
              throw new Error(account.error.message, { cause: account.error })
            }

            setAccount(account.result)
            setSnap(snap)
          }
          setIsConnected(isConnected)
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
  }, [snapConfig, snapId, snapVersion])

  // Callbacks
  const connect = useCallback(
    async (
      /** @type {Partial<import('filsnap-adapter').SnapConfig> | undefined} */ _config = snapConfig
    ) => {
      setIsLoading(true)
      setError(undefined)
      try {
        const snap = await FilsnapAdapter.connect(_config, snapId, snapVersion)
        setSnap(snap)
        const account = await snap.getAccountInfo()
        if (account.error) {
          setError(new Error(account.error.message, { cause: account.error }))
        }

        setAccount(account.result)
        setIsConnected(true)
      } catch (error) {
        const err = /** @type {Error} */ (error)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    },
    [snapConfig, snapId, snapVersion]
  )

  /** @type {import('./types.js').FilsnapContext} */
  const value = useMemo(() => {
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
        error: undefined,
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
        error: new Error('Oops something went wrong!'),
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

  return createElement(FilsnapContext.Provider, { value, children })
}

export function useFilsnapContext() {
  const context = useContext(FilsnapContext)
  if (context === undefined) {
    throw new Error(
      `useFilsnapContext must be used within a FilsnapContextProvider.`
    )
  }

  return context
}
