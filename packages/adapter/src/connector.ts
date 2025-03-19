import type { Network } from 'iso-filecoin/types'
import { metamask } from './chains'
import { FilsnapAdapter } from './snap'
import type { EIP1193Provider, ProviderConnectInfo } from './types'
import { chainIdtoNetwork, checkPermissions, getProvider } from './utils'

type ConnectorOptions = {
  provider: EIP1193Provider
  onAccountsChanged?: (accounts: string[]) => void
  onChainChanged?: (network?: Network) => void
  onDisconnect?: () => void
  onConnect?: (network?: Network) => void
}

/**
 * Create a connector for the EIP-1193 provider.
 *
 * @param options - The connector options.
 */
export function createConnector(options: ConnectorOptions) {
  let currentNetwork: Network | undefined
  let status: 'disconnected' | 'connected' | 'error' = 'disconnected'
  const { provider } = options
  if (!provider.isMetaMask) {
    throw new Error('Provider is not MetaMask')
  }

  function onChainChanged(chainId: string) {
    currentNetwork = chainIdtoNetwork(chainId)
    options.onChainChanged?.(currentNetwork)
  }
  function onDisconnect() {
    status = 'disconnected'
    options.onDisconnect?.()
    provider.removeListener('chainChanged', onChainChanged)
    provider.removeListener('disconnect', onDisconnect)
    // provider.removeListener('accountsChanged', onAccountsChanged)
  }

  async function onAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      onDisconnect()
    } else if (status === 'connected') {
      options.onAccountsChanged?.(accounts)
    } else {
      const chainId = await provider.request({ method: 'eth_chainId' })
      await onConnect({ chainId })
    }
  }

  async function onConnect(connectInfo: ProviderConnectInfo) {
    currentNetwork = chainIdtoNetwork(connectInfo.chainId)
    const accounts = await provider.request({ method: 'eth_accounts' })
    if (accounts.length === 0) {
      return
    }

    status = 'connected'
    options.onConnect?.(currentNetwork)
  }

  return {
    provider,

    setup() {
      provider.on('accountsChanged', onAccountsChanged)
      provider.on('chainChanged', onChainChanged)
      provider.on('disconnect', onDisconnect)

      return this
    },

    async connect(options: { network?: Network } = {}) {
      // Manage EIP-1193 event listeners
      // https://eips.ethereum.org/EIPS/eip-1193#events

      if (status !== 'connected') {
        // setup() has not been called yet
        provider.on('accountsChanged', onAccountsChanged)
        provider.on('chainChanged', onChainChanged)
        provider.on('disconnect', onDisconnect)
      }

      // connect to wallet
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      })

      // switch to chain
      await this.switchChain(options.network ?? currentNetwork)
      return { accounts, network: currentNetwork }
    },

    async disconnect() {
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

    async getNetwork() {
      if (!currentNetwork) {
        currentNetwork = chainIdtoNetwork(await this.getChainId())
      }
      return currentNetwork
    },

    async switchChain(network: Network | undefined = currentNetwork) {
      if (network === undefined) {
        network = 'mainnet'
      }
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

    async permissions() {
      return await checkPermissions(provider)
    },
  }
}

/**
 * Synchronizes with the provider to establish connection with Filsnap adapter.
 * If no provider is passed, it will attempt to get the MetaMask provider. See {@link getProvider}.
 *
 * @example
 * ```ts twoslash
 * import { syncWithProvider, getProvider } from 'filsnap-adapter'
 *
 * const connector = await syncWithProvider({
 *   provider: await getProvider(), // optional, will attempt to get the MetaMask provider
 *   version: '0.1.0', // optional, defaults to '*'
 *   reconnect: true // optional, defaults to true
 * })
 * ```
 */
export async function syncWithProvider({
  provider,
  reconnect = true,
  version = '*',
}: {
  provider?: EIP1193Provider
  reconnect?: boolean
  version?: string
} = {}) {
  if (!provider) {
    try {
      provider = await getProvider()
    } catch {
      // ignore
    }
  }

  if (!provider || !provider.isMetaMask) {
    return
  }

  let adapter: FilsnapAdapter | undefined

  const connector = createConnector({
    provider,
    onChainChanged: async (network) => {
      if (adapter && network) {
        adapter.changeNetwork(network)
      }
      if (!adapter && network) {
        adapter = await FilsnapAdapter.connect({
          provider,
          snapId: 'npm:filsnap',
          snapVersion: version,
          config: { network },
        })
      }
    },
    onConnect: async (network) => {
      if (network && !adapter) {
        adapter = await FilsnapAdapter.connect({
          provider,
          snapId: 'npm:filsnap',
          snapVersion: version,
          config: { network },
        })
      }
    },
    onDisconnect: () => {
      if (adapter) {
        adapter.disconnect()
        adapter = undefined
      }
    },
  }).setup()

  // reconnect to adapter
  if (reconnect) {
    const { wallet } = await connector.permissions()
    const network = await connector.getNetwork()

    if (wallet && network) {
      adapter = await FilsnapAdapter.connect({
        provider,
        snapId: 'npm:filsnap',
        snapVersion: version,
        config: { network },
      })
    }
  }

  return connector
}
