import type { FilSnapMethods, Network, SnapConfig } from 'filsnap'
import { RPC } from 'iso-filecoin/rpc'
import type { Provider } from './utils'
import { getRequestProvider, getSnap } from './utils'

export class FilsnapAdapter {
  readonly snapId: string
  readonly snapVersion: string
  private static provider: Provider
  config: SnapConfig | undefined

  public constructor(snapId: string, snapVersion: string) {
    this.snapId = snapId
    this.snapVersion = snapVersion
  }

  static async getProvider(): Promise<Provider> {
    if (!FilsnapAdapter.provider) {
      FilsnapAdapter.provider = await getRequestProvider()
    }
    return FilsnapAdapter.provider
  }

  /**
   * Check if Metamask has Snaps API
   */
  static async hasSnaps(): Promise<boolean> {
    const provider = await FilsnapAdapter.getProvider()

    if (!provider || !provider.isMetaMask) {
      return false
    }

    try {
      await provider.request({
        method: 'wallet_getSnaps',
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * Check if Filsnap is installed and enabled
   *
   * @param snapId - Snap ID to check for. Defaults to `npm:filsnap` which is the default ID for the Filsnap snap.
   * @param snapVersion - Snap version to check for. Defaults to `*` which matches any version.
   */
  static async isAvailable(
    snapId = 'npm:filsnap',
    snapVersion = '*'
  ): Promise<boolean> {
    const hasSnaps = await FilsnapAdapter.hasSnaps()
    if (!hasSnaps) {
      return false
    }

    const provider = await FilsnapAdapter.getProvider()
    const snaps = await provider.request({ method: 'wallet_getSnaps' })

    const snap = snaps[snapId]

    if (snap == null || 'error' in snap) {
      return false
    }

    const isSnapBlocked = snap?.blocked === true
    const isSnapEnabled = snap?.enabled === true
    const isVersionMatch = snapVersion === '*' || snap?.version === snapVersion

    return !isSnapBlocked && isSnapEnabled && isVersionMatch
  }

  /**
   * Installs and connects to Filsnap
   *
   * @throws Error if Metamask is not installed
   *
   * @param config - Snap config
   * @param snapId - Snap ID to check for. Defaults to `npm:filsnap` which is the default ID for the Filsnap snap.
   * @param snapVersion - Snap version to check for. Defaults to `*` which matches any version.
   */
  static async connect(
    config: Parameters<FilSnapMethods['fil_configure']>[1],
    snapId = 'npm:filsnap',
    snapVersion = '*'
  ): Promise<FilsnapAdapter> {
    const hasSnaps = await FilsnapAdapter.hasSnaps()
    if (!hasSnaps) {
      throw new Error(
        'Metamask does not have the Snaps API. Please update to the latest version.'
      )
    }

    const provider = await FilsnapAdapter.getProvider()
    const snap = await getSnap(provider, snapId, snapVersion)
    const adapter = new FilsnapAdapter(snapId, snap.version)
    const result = await adapter.configure(config)

    if (result.error) {
      throw new Error(result.error.message)
    }

    return adapter
  }

  /**
   * Check dapp is connected to Filsnap
   *
   * @returns `true` if connected to Filsnap, `false` otherwise
   */
  isConnected(): boolean {
    return this.config != null
  }

  /**
   * Get the RPC instance configured by Filsnap
   *
   * @returns RPC instance
   */
  rpc(): RPC {
    if (this.config == null) {
      throw new Error('Not connected to Filsnap')
    }

    return new RPC({
      token: this.config.rpc.token,
      api: this.config.rpc.url,
      network: this.config.network,
    })
  }
  /**
   * Configure the snap
   *
   * @param params - {@link FilSnapMethods.fil_configure} params
   */
  async configure(
    params: Parameters<FilSnapMethods['fil_configure']>[1]
  ): ReturnType<FilSnapMethods['fil_configure']> {
    const provider = await FilsnapAdapter.getProvider()
    const config = await provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_configure',
          params,
        },
        snapId: this.snapId,
      },
    })

    if (config.result != null) {
      this.config = config.result
    }

    return config
  }

  /**
   * Request account info from the snap
   *
   * @see {@link FilSnapMethods.fil_getAccountInfo}
   */
  async getAccountInfo(): ReturnType<FilSnapMethods['fil_getAccountInfo']> {
    const provider = await FilsnapAdapter.getProvider()
    return await provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_getAccountInfo',
        },
        snapId: this.snapId,
      },
    })
  }

  /**
   * Request account address from the snap
   *
   * @see {@link FilSnapMethods.fil_getAddress}
   */
  async getAddress(): ReturnType<FilSnapMethods['fil_getAddress']> {
    const provider = await FilsnapAdapter.getProvider()
    return await provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_getAddress',
        },
        snapId: this.snapId,
      },
    })
  }

  /**
   * Request account public key from the snap
   *
   * @see {@link FilSnapMethods.fil_getPublicKey}
   */
  async getPublicKey(): ReturnType<FilSnapMethods['fil_getPublicKey']> {
    const provider = await FilsnapAdapter.getProvider()
    return await provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_getPublicKey',
        },
        snapId: this.snapId,
      },
    })
  }

  /**
   * Export the account private key from the snap
   *
   * @see {@link FilSnapMethods.fil_exportPrivateKey}
   */
  async exportPrivateKey(): ReturnType<FilSnapMethods['fil_exportPrivateKey']> {
    const provider = await FilsnapAdapter.getProvider()
    return await provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_exportPrivateKey',
        },
        snapId: this.snapId,
      },
    })
  }

  /**
   * Request account balance from the snap
   *
   * @see {@link FilSnapMethods.fil_getBalance}
   */
  async getBalance(): ReturnType<FilSnapMethods['fil_getBalance']> {
    const provider = await FilsnapAdapter.getProvider()
    return await provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_getBalance',
        },
        snapId: this.snapId,
      },
    })
  }

  /**
   * Sign a message
   *
   * @param params - {@link FilSnapMethods.fil_signMessage} params
   */
  async signMessage(
    params: Parameters<FilSnapMethods['fil_signMessage']>[1]
  ): ReturnType<FilSnapMethods['fil_signMessage']> {
    const provider = await FilsnapAdapter.getProvider()
    return await provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_signMessage',
          params,
        },
        snapId: this.snapId,
      },
    })
  }

  /**
   * Sign a raw message
   *
   * @param params - {@link FilSnapMethods.fil_signMessageRaw} params
   */
  async signMessageRaw(
    params: Parameters<FilSnapMethods['fil_signMessageRaw']>[1]
  ): ReturnType<FilSnapMethods['fil_signMessageRaw']> {
    const provider = await FilsnapAdapter.getProvider()
    return await provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_signMessageRaw',
          params,
        },
        snapId: this.snapId,
      },
    })
  }

  /**
   * Send a signed message
   *
   * @param params - {@link FilSnapMethods.fil_sendMessage} params
   */
  async sendMessage(
    params: Parameters<FilSnapMethods['fil_sendMessage']>[1]
  ): ReturnType<FilSnapMethods['fil_sendMessage']> {
    const provider = await FilsnapAdapter.getProvider()
    return await provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_sendMessage',
          params,
        },
        snapId: this.snapId,
      },
    })
  }

  /**
   * Estimate the gas for a message
   *
   * `maxFee` is optional and defaults to `100000000000000000` attoFIL (0.1 FIL)
   *
   * @param params -`fil_getGasForMessage` RPC method params
   */
  async calculateGasForMessage(
    params: Parameters<FilSnapMethods['fil_getGasForMessage']>[1]
  ): ReturnType<FilSnapMethods['fil_getGasForMessage']> {
    const provider = await FilsnapAdapter.getProvider()
    return await provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_getGasForMessage',
          params,
        },
        snapId: this.snapId,
      },
    })
  }

  /**
   * Switch to or add a different network
   *
   * @param network - Network to switch to. Defaults to `mainnet`
   */
  async switchOrAddChain(network: Network): Promise<void> {
    let config = {
      chainId: '0x13A',
      chainName: 'Filecoin',
      rpcUrls: ['https://api.node.glif.io/rpc/v1'],
      blockExplorerUrls: ['https://filfox.info', 'https://explorer.glif.io/'],
      nativeCurrency: {
        name: 'Filecoin',
        symbol: 'FIL',
        decimals: 18,
      },
      iconUrls: ['https://filsnap.fission.app/filecoin-logo.svg'],
    }

    if (network === 'testnet') {
      config = {
        chainId: '0x4CB2F',
        chainName: 'Filecoin Calibration testnet',
        rpcUrls: ['https://api.calibration.node.glif.io/rpc/v1'],
        blockExplorerUrls: ['https://filfox.info', 'https://explorer.glif.io/'],
        nativeCurrency: {
          name: 'Filecoin',
          symbol: 'tFIL',
          decimals: 18,
        },
        iconUrls: ['https://filsnap.fission.app/filecoin-logo.svg'],
      }
    }

    const provider = await FilsnapAdapter.getProvider()
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: config.chainId }],
      })
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
        } catch (error) {
          throw new Error('Failed to add chain to MetaMask.', { cause: error })
        }
      } else {
        throw new Error('Failed to add switch to MetaMask.', { cause: err })
      }
    }
  }
}
