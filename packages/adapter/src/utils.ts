import type { Snap } from '@metamask/snaps-sdk'
import type { Network } from 'filsnap'

import { metamask } from './chains'
import type { EIP1193Provider, EIP6963AnnounceProviderEvent } from './types'

/**
 * Get the Metamask provider.
 *
 * @param timeout - The timeout in milliseconds.
 * @returns The request provider.
 */
export async function getProvider(timeout = 1000): Promise<EIP1193Provider> {
  let timeoutHandle = 0
  return await new Promise((resolve, reject) => {
    const onProviderFound = (event: EIP6963AnnounceProviderEvent): void => {
      clearTimeout(timeoutHandle) // Clear the timeout on successful provider detection
      const { rdns } = event.detail.info
      switch (rdns) {
        case 'io.metamask':
        case 'io.metamask.flask':
        case 'io.metamask.mmi': {
          const provider = event.detail.provider
          if (!provider || !provider.isMetaMask) {
            reject(new Error('Provider not supported or not found.'))
          } else {
            window.removeEventListener(
              'eip6963:announceProvider',
              onProviderFound
            )
            resolve(provider)
          }
          break
        }
        default: {
          console.error('Provider not supported or not found.', rdns)
          reject(new Error('Provider not supported or not found.'))
          break
        }
      }
    }

    window.addEventListener(
      'eip6963:announceProvider',
      onProviderFound as EventListener
    )

    window.dispatchEvent(new CustomEvent('eip6963:requestProvider'))
    // Set a timeout to reject the promise if no provider is found within the specified time
    timeoutHandle = window.setTimeout(() => {
      window.removeEventListener('eip6963:announceProvider', onProviderFound)
      reject(new Error('Provider request timed out.'))
    }, timeout)
  })
}

type ConnectorOptions = {
  provider: EIP1193Provider
  onAccountsChanged?: (accounts: string[]) => void
  onChainChanged?: (chainId: string) => void
  onDisconnect?: () => void
  onConnect?: () => void
}

export type Promisable<T> = T | Promise<T>

/**
 * Create a connector for the EIP-1193 provider.
 *
 * @param options - The connector options.
 */
export function createConnector(options: ConnectorOptions) {
  let currentNetwork: Network
  const { provider } = options

  let onAccountsChanged: ((accounts: string[]) => void) | undefined
  let onChainChanged: ((chainId: string) => void) | undefined
  let onDisconnect: (() => void) | undefined
  let onConnect: (() => void) | undefined

  return {
    getProvider: () => provider,

    setup() {
      if (!onConnect) {
        onConnect = this.onConnect.bind(this)
        provider.on('connect', onConnect)
      }

      if (!onAccountsChanged) {
        onAccountsChanged = this.onAccountsChanged.bind(this)
        provider.on('accountsChanged', onAccountsChanged)
      }

      this.getChainId().then((chainId) => {
        currentNetwork = this.chainIdtoNetwork(chainId)
      })

      return this
    },

    async connect(options: { network?: Network } = {}) {
      // connect to wallet
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      })

      // Manage EIP-1193 event listeners
      // https://eips.ethereum.org/EIPS/eip-1193#events

      if (onConnect) {
        provider.removeListener('connect', onConnect)
        onConnect = undefined
      }

      if (!onAccountsChanged) {
        onAccountsChanged = this.onAccountsChanged.bind(this)
        provider.on('accountsChanged', onAccountsChanged)
      }

      if (!onChainChanged) {
        onChainChanged = this.onChainChanged.bind(this)
        provider.on('chainChanged', onChainChanged)
      }

      if (!onDisconnect) {
        onDisconnect = this.onDisconnect.bind(this)
        provider.on('disconnect', onDisconnect)
      }

      // switch to chain
      currentNetwork = this.chainIdtoNetwork(await this.getChainId())
      await this.switchChain(options.network ?? currentNetwork)
      return { accounts, network: currentNetwork }
    },

    async disconnect() {
      if (onChainChanged) {
        provider.removeListener('chainChanged', onChainChanged)
        onChainChanged = undefined
      }
      if (onDisconnect) {
        provider.removeListener('disconnect', onDisconnect)
        onDisconnect = undefined
      }
      if (!onConnect) {
        onConnect = this.onConnect.bind(this)
        provider.on('connect', onConnect)
      }
      await provider.request({
        method: 'wallet_revokePermissions',
        params: [
          {
            eth_accounts: {},
          },
        ],
      })
    },

    async getChainId() {
      return await provider.request({ method: 'eth_chainId' })
    },

    chainIdtoNetwork(chainId: string) {
      return chainId === metamask.testnet.chainId
        ? 'testnet'
        : chainId === metamask.mainnet.chainId
          ? 'mainnet'
          : currentNetwork
    },

    async switchChain(network: Network = currentNetwork) {
      const config = network === 'testnet' ? metamask.testnet : metamask.mainnet

      if (currentNetwork === network) {
        return network
      }

      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: config.chainId }],
        })
        currentNetwork = network
        return currentNetwork
      } catch (switchError) {
        const err = switchError as Error & {
          code: number
        }

        // This error code indicates that the chain has not been added to MetaMask.
        if (err.code === 4902) {
          try {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [config],
            })
            const currentChainId = await this.getChainId()
            if (currentChainId !== config.chainId) {
              throw new Error('User rejected switch after adding network.')
            }
            currentNetwork = network
            return currentNetwork
          } catch (error) {
            throw new Error('Failed to add chain to MetaMask.', {
              cause: error,
            })
          }
        } else {
          throw new Error('Failed to add/switch chain to MetaMask.', {
            cause: err,
          })
        }
      }
    },

    async getAccounts() {
      return await provider.request({ method: 'eth_accounts' })
    },

    async onConnect() {
      const accounts = await this.getAccounts()
      if (accounts.length === 0) {
        return
      }

      options.onConnect?.()

      if (onConnect) {
        provider.removeListener('connect', onConnect)
        onConnect = undefined
      }

      if (!onAccountsChanged) {
        onAccountsChanged = this.onAccountsChanged.bind(this)
        provider.on('accountsChanged', onAccountsChanged)
      }

      if (!onChainChanged) {
        onChainChanged = this.onChainChanged.bind(this)
        provider.on('chainChanged', onChainChanged)
      }

      if (!onDisconnect) {
        onDisconnect = this.onDisconnect.bind(this)
        provider.on('disconnect', onDisconnect)
      }
    },

    async permissions() {
      return await checkPermissions(provider)
    },

    onChainChanged(chainId: string) {
      options.onChainChanged?.(chainId)
    },

    onAccountsChanged(accounts: string[]) {
      if (accounts.length === 0) {
        this.onDisconnect()
      } else {
        options.onAccountsChanged?.(accounts)
      }
    },

    onDisconnect() {
      options.onDisconnect?.()
      if (onAccountsChanged) {
        provider.removeListener('accountsChanged', onAccountsChanged)
        onAccountsChanged = undefined
      }

      if (onChainChanged) {
        provider.removeListener('chainChanged', onChainChanged)
        onChainChanged = undefined
      }

      if (onDisconnect) {
        provider.removeListener('disconnect', onDisconnect)
        onDisconnect = undefined
      }
    },
  }
}

/**
 * Get or install a snap
 *
 * @param provider - The provider to get the snap from
 * @param snapId - The snap ID to get
 * @param snapVersion - The snap version to get
 */
export async function getOrInstallSnap(
  provider: EIP1193Provider,
  snapId = 'npm:filsnap',
  snapVersion = '*'
): Promise<Snap> {
  const snap = await getSnap(provider, snapId, snapVersion)

  // try to install the snap
  if (snap == null) {
    try {
      const snaps = await provider.request({
        method: 'wallet_requestSnaps',
        params: {
          [snapId]: {
            version: snapVersion,
          },
        },
      })
      const snap = snaps[snapId]
      if (snap == null) {
        throw new Error(`Failed to install to snap ${snapId} ${snapVersion}`)
      }

      if ('error' in snap) {
        throw new Error(
          `Failed to install to snap ${snapId} ${snapVersion} with error "${snap.error.message}"`
        )
      }
      return snap
    } catch (error) {
      const err = error as Error
      throw new Error(
        `Failed to install to snap ${snapId} ${snapVersion} with error "${err.message}"`
      )
    }
  }

  return snap
}

/**
 * Get a snap
 *
 * @param provider - The provider to get the snap from
 * @param snapId - Snap ID to check for. Defaults to `npm:filsnap`.
 * @param snapVersion - Snap version to check for. Defaults to `*` which matches any version.
 */
export async function getSnap(
  provider: EIP1193Provider,
  snapId = 'npm:filsnap',
  snapVersion = '*'
): Promise<Snap | undefined> {
  const snaps = await provider.request({ method: 'wallet_getSnaps' })

  const snap = snaps[snapId]

  if (snap == null) {
    return undefined
  }

  if ('error' in snap) {
    throw new Error(
      `Failed to connect to snap ${snapId} ${snapVersion} with error ${snap.error.message}`
    )
  }

  if (snap.blocked === true) {
    throw new Error(`Snap ${snapId} ${snapVersion} is blocked`)
  }

  if (snap.enabled === false) {
    throw new Error(`Snap ${snapId} ${snapVersion} is not enabled`)
  }

  // if (snapVersion !== '*' && snap.version !== snapVersion) {
  //   throw new Error(`Snap ${snapId} ${snapVersion} is not the correct version`)
  // }

  return snap
}

/**
 * Check if Metamask has Snaps API
 *
 * @param provider - The provider to check for snaps
 */
export async function hasSnaps(provider: EIP1193Provider): Promise<boolean> {
  try {
    await provider.request({ method: 'wallet_getSnaps' })
    return true
  } catch {
    return false
  }
}

/**
 * Check if a snap is connected, enabled and not blocked
 *
 * @param provider - The provider to check for snaps
 * @param snapId - Snap ID to check for. Defaults to `npm:filsnap`.
 * @param snapVersion - Snap version to check for. Defaults to `*` which matches any version.
 */
export async function isConnected(
  provider: EIP1193Provider,
  snapId = 'npm:filsnap',
  snapVersion = '*'
): Promise<boolean> {
  try {
    const snap = await getSnap(provider, snapId, snapVersion)

    if (snap == null) {
      return false
    }

    return true
  } catch {
    return false
  }
}

export async function checkPermissions(
  provider: EIP1193Provider
): Promise<{ snap: boolean; wallet: boolean }> {
  try {
    const perms = await provider.request({
      method: 'wallet_getPermissions',
    })
    if (perms.length === 0) {
      return {
        snap: false,
        wallet: false,
      }
    }

    let wallet = false
    let snap = false

    if (perms.length > 0) {
      for (const element of perms) {
        if (element.parentCapability === 'wallet_snap') {
          // TODO check caveats for filsnap to make sure
          snap = true
        }

        if (element.parentCapability === 'eth_accounts') {
          // TODO check caveats for filsnap to make sure
          wallet = true
        }
      }
    }

    return { snap, wallet }
  } catch {
    return {
      snap: false,
      wallet: false,
    }
  }
}
