import type { AccountInfo, FilSnapMethods, Snap, SnapConfig } from 'filsnap'
import { RPC } from 'iso-filecoin/rpc'
import { metamask } from './chains'
import type { EIP1193Provider } from './types'
import { getOrInstallSnap, getSnap } from './utils'

export type FilsnapAdapterOptions = {
  /**
   * EIP-1193 provider
   */
  provider: EIP1193Provider
  /**
   * Snap info from `wallet_getSnaps`
   */
  snap: Snap
}

export type ConnectOptions = {
  /**
   * @default 'npm:filsnap'
   */
  snapId?: string
  /**
   * @default '*'
   */
  snapVersion?: string
  /**
   * EIP-1193 provider
   */
  provider: EIP1193Provider
  /**
   * Snap config
   */
  config: Partial<SnapConfig>
}

/**
 * Generic result with error
 */
export type MaybeResult<ResultType = unknown, ErrorType = Error> =
  | {
      error: ErrorType
      result?: undefined
    }
  | {
      result: ResultType
      error?: undefined
    }

export class FilsnapAdapter {
  readonly snap: Snap
  readonly provider: EIP1193Provider
  config: SnapConfig | undefined

  public constructor(options: FilsnapAdapterOptions) {
    this.snap = options.snap
    this.provider = options.provider
  }

  /**
   * Installs and connects to Filsnap
   *
   * @throws Error if Metamask is not installed
   *
   * @param options - Connect options
   */
  static async connect(options: ConnectOptions): Promise<FilsnapAdapter> {
    // connect to snap
    const snap = await getOrInstallSnap(
      options.provider,
      options.snapId,
      options.snapVersion
    )

    const adapter = new FilsnapAdapter({
      provider: options.provider,
      snap,
    })
    const result = await adapter.configure(options.config)

    if (result.error) {
      throw new Error(result.error.message)
    }

    return adapter
  }

  static async reconnect(options: Omit<ConnectOptions, 'config'>): Promise<
    | {
        adapter: FilsnapAdapter
        account: AccountInfo
      }
    | undefined
  > {
    const snap = await getSnap(
      options.provider,
      options.snapId,
      options.snapVersion
    )

    if (snap) {
      const adapter = new FilsnapAdapter({
        snap,
        provider: options.provider,
      })
      const info = await adapter.getAccountInfo()
      if (info.error) {
        throw new Error(info.error.message, { cause: info.error })
      }
      return { adapter, account: info.result }
    }
  }

  async disconnect(): Promise<void> {
    await this.provider.request({
      method: 'wallet_revokePermissions',
      params: [
        {
          wallet_snap: {},
        },
      ],
    })
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
    params: Parameters<FilSnapMethods['fil_configure']>[1] = {}
  ): ReturnType<FilSnapMethods['fil_configure']> {
    const config = await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_configure',
          params,
        },
        snapId: this.snap.id,
      },
    })

    if (config.result) {
      this.config = config.result
    }

    return config
  }

  /**
   * Change the chain
   *
   * @param chain - Chain to switch to
   */
  async changeChain(
    chain: string | number
  ): ReturnType<FilSnapMethods['fil_configure']> {
    let network = this.config?.network

    if (
      chain === metamask.testnet.chainId ||
      chain === 314_159 ||
      chain === 'testnet'
    ) {
      network = 'testnet'
    }

    if (
      chain === metamask.mainnet.chainId ||
      chain === 314 ||
      chain === 'mainnet'
    ) {
      network = 'mainnet'
    }

    if (this.config && this.config.network === network) {
      return { result: this.config, error: null }
    }
    const config = await this.configure({ network })
    return config
  }

  /**
   * Request account info from the snap
   *
   * @see {@link FilSnapMethods.fil_getAccountInfo}
   */
  async getAccountInfo(): ReturnType<FilSnapMethods['fil_getAccountInfo']> {
    const info = await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_getAccountInfo',
        },
        snapId: this.snap.id,
      },
    })

    if (info.result) {
      this.config = info.result.config
    }

    return info
  }

  /**
   * Request account address from the snap
   *
   * @see {@link FilSnapMethods.fil_getAddress}
   */
  async getAddress(): ReturnType<FilSnapMethods['fil_getAddress']> {
    return await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_getAddress',
        },
        snapId: this.snap.id,
      },
    })
  }

  /**
   * Request account public key from the snap
   *
   * @see {@link FilSnapMethods.fil_getPublicKey}
   */
  async getPublicKey(): ReturnType<FilSnapMethods['fil_getPublicKey']> {
    return await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_getPublicKey',
        },
        snapId: this.snap.id,
      },
    })
  }

  /**
   * Export the account private key from the snap
   *
   * @see {@link FilSnapMethods.fil_exportPrivateKey}
   */
  async exportPrivateKey(): ReturnType<FilSnapMethods['fil_exportPrivateKey']> {
    return await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_exportPrivateKey',
        },
        snapId: this.snap.id,
      },
    })
  }

  /**
   * Request account balance from the snap
   *
   * @see {@link FilSnapMethods.fil_getBalance}
   */
  async getBalance(): ReturnType<FilSnapMethods['fil_getBalance']> {
    return await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_getBalance',
        },
        snapId: this.snap.id,
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
    return await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_signMessage',
          params,
        },
        snapId: this.snap.id,
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
    return await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_signMessageRaw',
          params,
        },
        snapId: this.snap.id,
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
    return await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_sendMessage',
          params,
        },
        snapId: this.snap.id,
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
    return await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_getGasForMessage',
          params,
        },
        snapId: this.snap.id,
      },
    })
  }
}
