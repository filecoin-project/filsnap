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
export function OddContextProvider({ snapId, snapVersion, config, children }) {
  // State
  const [error, setError] = useState(
    /** @type {Error |undefined} */ (undefined)
  )
  const [snap, setSnap] = useState(
    /** @type {FilsnapAdapter |undefined} */ (undefined)
  )
  const [account, setAccount] = useState(
    /** @type {import('filsnap-adapter').AccountInfo | undefined | null} */ (
      undefined
    )
  )
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasFlask, setHasFlask] = useState(false)

  // Effects
  useEffect(() => {
    let mounted = true
    async function setup() {
      if (mounted) {
        setError(undefined)
        try {
          setHasFlask(await FilsnapAdapter.hasFlask())
          const isConnected = await FilsnapAdapter.isConnected(snapId)
          if (isConnected) {
            const snap = await FilsnapAdapter.connect(
              config,
              snapId,
              snapVersion
            )
            const account = await snap.getAccountInfo()
            if (account.error) {
              setError(
                new Error(account.error.message, { cause: account.error })
              )
            }

            setAccount(account.result)
            setSnap(snap)
          }
          setIsConnected(isConnected)
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
  }, [config, snapId, snapVersion])

  // Callbacks
  const connect = useCallback(
    async (
      /** @type {Partial<import('filsnap-adapter').SnapConfig> | undefined} */ _config = config
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
    [config, snapId, snapVersion]
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
    }
  }, [account, connect, error, hasFlask, isConnected, isLoading, snap])

  return createElement(FilsnapContext.Provider, { value, children })
}

export function useFilsnapContext() {
  const context = useContext(FilsnapContext)
  if (context === undefined) {
    throw new Error(
      `useFilsnapContext must be used within a OddContextProvider.`
    )
  }

  return context
}
