import type {
  FilSnapMethods,
  Network,
  RequestWithFilSnap,
  SnapConfig,
} from 'filsnap'

type SnapsResult = Record<
  string,
  { id: string; version: string; blocked: boolean; enabled: true }
>

export class FilsnapAdapter {
  readonly snapId: string
  readonly request: RequestWithFilSnap
  config: SnapConfig | undefined

  public constructor(snapId: string) {
    this.snapId = snapId
    this.request = window.ethereum.request as RequestWithFilSnap
  }

  static async hasFlask(): Promise<boolean> {
    if (window.ethereum == null || !window.ethereum.isMetaMask) {
      return false
    }

    const version = await window.ethereum.request<string>({
      method: 'web3_clientVersion',
    })

    if (version == null || (version.length > 0 && !version.includes('flask'))) {
      return false
    }

    return true
  }

  static async isConnected(snapId: string = 'npm:filsnap'): Promise<boolean> {
    const hasFlask = await FilsnapAdapter.hasFlask()
    if (!hasFlask) {
      return false
    }

    const snaps = await window.ethereum.request<SnapsResult>({
      method: 'wallet_getSnaps',
    })

    if (snaps == null || snaps[snapId] == null) {
      return false
    }

    if (snaps[snapId]?.blocked === true) {
      return false
    }

    if (snaps[snapId]?.enabled !== true) {
      return false
    }

    return true
  }

  static async create(
    config: Parameters<FilSnapMethods['fil_configure']>[1],
    snapId: string = 'npm:filsnap'
  ): Promise<FilsnapAdapter> {
    const hasFlask = await FilsnapAdapter.hasFlask()
    if (!hasFlask) {
      throw new Error('Flask is not installed.')
    }

    const isConnected = await FilsnapAdapter.isConnected(snapId)

    if (!isConnected) {
      throw new Error('Filsnap is not connected.')
    }

    const adapter = new FilsnapAdapter(snapId)
    await adapter.configure(config)
    return adapter
  }

  static async connect(
    config: Parameters<FilSnapMethods['fil_configure']>[1],
    snapId: string = 'npm:filsnap',
    snapVersion: string = '*'
  ): Promise<FilsnapAdapter> {
    const hasFlask = await FilsnapAdapter.hasFlask()
    if (!hasFlask) {
      throw new Error('Flask is not installed')
    }

    const snaps = await window.ethereum.request<SnapsResult>({
      method: 'wallet_requestSnaps',
      params: {
        [snapId]: {
          version: snapVersion,
        },
      },
    })

    if (snaps == null || snaps[snapId] == null) {
      throw new Error(`Failed to connect to snap ${snapId} ${snapVersion}`)
    }

    const adapter = new FilsnapAdapter(snapId)
    await adapter.configure(config)
    return adapter
  }

  async configure(
    params: Parameters<FilSnapMethods['fil_configure']>[1]
  ): ReturnType<FilSnapMethods['fil_configure']> {
    const config = await this.request({
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

  async getAccountInfo(): ReturnType<FilSnapMethods['fil_getAccountInfo']> {
    return await this.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_getAccountInfo',
        },
        snapId: this.snapId,
      },
    })
  }

  async getAddress(): ReturnType<FilSnapMethods['fil_getAddress']> {
    return await this.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_getAddress',
        },
        snapId: this.snapId,
      },
    })
  }

  async getPublicKey(): ReturnType<FilSnapMethods['fil_getPublicKey']> {
    return await this.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_getPublicKey',
        },
        snapId: this.snapId,
      },
    })
  }

  async exportPrivateKey(): ReturnType<FilSnapMethods['fil_exportPrivateKey']> {
    return await this.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_exportPrivateKey',
        },
        snapId: this.snapId,
      },
    })
  }

  async getBalance(): ReturnType<FilSnapMethods['fil_getBalance']> {
    return await this.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_getBalance',
        },
        snapId: this.snapId,
      },
    })
  }

  async getMessages(): ReturnType<FilSnapMethods['fil_getMessages']> {
    return await this.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_getMessages',
        },
        snapId: this.snapId,
      },
    })
  }

  async signMessage(
    params: Parameters<FilSnapMethods['fil_signMessage']>[1]
  ): ReturnType<FilSnapMethods['fil_signMessage']> {
    return await this.request({
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

  async signMessageRaw(
    params: Parameters<FilSnapMethods['fil_signMessageRaw']>[1]
  ): ReturnType<FilSnapMethods['fil_signMessageRaw']> {
    return await this.request({
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

  async sendMessage(
    params: Parameters<FilSnapMethods['fil_sendMessage']>[1]
  ): ReturnType<FilSnapMethods['fil_sendMessage']> {
    return await this.request({
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
    return await this.request({
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

    try {
      await this.request({
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
          await ethereum.request({
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
