import type {
  AccountInfo,
  FilSnapMethods,
  Snap,
  SnapConfig,
  SnapResponse,
} from 'filsnap'
import { base64pad, hex } from 'iso-base/rfc4648'
import { fromString } from 'iso-filecoin/address'
import { RPC } from 'iso-filecoin/rpc'
import { Signature } from 'iso-filecoin/signature'
import type { IAccount, Network } from 'iso-filecoin/types'
import { getNetworkFromChainId } from 'iso-filecoin/utils'
import type { SetRequired } from 'type-fest'
import type { EIP1193Provider } from './types'
import { getOrInstallSnap, getProvider, getSnap } from './utils'

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
   *
   * @see use {@link getProvider} to resolve the metamask provider
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

  /**
   * Reconnects to an existing Filsnap installation
   *
   * @param options - Connect options without config
   * @returns Adapter instance and account info if snap is installed, undefined otherwise
   *
   * @example
   * ```ts
   * import { FilsnapAdapter } from 'filsnap-adapter'
   *
   * const connection = await FilsnapAdapter.reconnect({
   *   provider: window.ethereum,
   *   snapId: 'npm:filsnap'
   * })
   *
   * if (connection) {
   *   const { adapter, account } = connection
   *   console.log('Reconnected to account:', account.address)
   * }
   * ```
   */
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

  /**
   * Disconnect provider
   *
   * @example
   * ```ts
   * import { FilsnapAdapter } from 'filsnap-adapter'
   *
   * const adapter = await FilsnapAdapter.connect({
   *   provider: window.ethereum,
   *   snapId: 'npm:filsnap',
   * })
   * await adapter.disconnect()
   * ```
   */
  async disconnect(): Promise<void> {
    await this.provider.request({
      method: 'wallet_revokePermissions',
      params: [
        {
          wallet_snap: {},
        },
      ],
    })

    this.config = undefined
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
   * Change the current network and derive a new account for that network
   *
   * @param network - Network to switch to (mainnet, testnet, etc)
   * @returns Response containing the new network and derived account
   *
   * @example
   * ```ts
   * import { FilsnapAdapter, getProvider } from 'filsnap-adapter'
   *
   * const adapter = await FilsnapAdapter.connect({
   *   provider: getProvider(),
   *   snapId: 'npm:filsnap',
   *   config: { network: 'testnet' },
   * })
   * const response = await adapter.changeNetwork('mainnet')
   * console.log(response.result.network) // 'mainnet'
   * console.log(response.result.account.address) // 'f1...'
   * ```
   */
  async changeNetwork(
    network: Network
  ): Promise<
    SnapResponse<{ network: Network; account: SetRequired<IAccount, 'path'> }>
  > {
    const out = await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_setConfig',
          params: {
            network,
          },
        },
        snapId: this.snap.id,
      },
    })
    if (out.error) {
      return out
    }

    this.config = out.result.config

    return {
      error: null,
      result: {
        network,
        account: {
          address: fromString(out.result.account.address),
          publicKey: hex.decode(out.result.account.publicKey),
          path: out.result.account.path,
          type: out.result.account.type,
        },
      },
    }
  }

  /**
   * Derive new account using provided index
   */
  async deriveAccount(
    index: number
  ): Promise<SnapResponse<SetRequired<IAccount, 'path'>>> {
    const out = await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_setConfig',
          params: {
            index,
          },
        },
        snapId: this.snap.id,
      },
    })

    if (out.error) {
      return out
    }

    this.config = out.result.config

    return {
      error: null,
      result: {
        address: fromString(out.result.account.address),
        publicKey: hex.decode(out.result.account.publicKey),
        path: out.result.account.path,
        type: out.result.account.type,
      },
    }
  }

  /**
   * Get current account data
   */
  async getAccount(): Promise<SnapResponse<SetRequired<IAccount, 'path'>>> {
    const out = await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_getAccount',
        },
        snapId: this.snap.id,
      },
    })

    if (out.error) {
      return out
    }

    return {
      error: null,
      result: {
        address: fromString(out.result.address),
        publicKey: hex.decode(out.result.publicKey),
        path: out.result.path,
        type: out.result.type,
      },
    }
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
   * Sign a Filecoin message
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
   * Sign arbitrary bytes
   *
   * @param data - Data to sign
   */
  async sign(data: Uint8Array): Promise<SnapResponse<Signature>> {
    const sign = await this.provider.request({
      method: 'wallet_invokeSnap',
      params: {
        request: {
          method: 'fil_sign',
          params: {
            data: base64pad.encode(data),
          },
        },
        snapId: this.snap.id,
      },
    })

    if (sign.error) {
      return sign
    }

    return {
      error: null,
      result: Signature.fromLotusHex(sign.result),
    }
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

  /**
   * Request account info with balance from the snap
   *
   * @deprecated use {@link getAccount} instead
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
   * @deprecated use {@link getAccount} instead
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
   * @deprecated use {@link getAccount} instead
   * @see {@link FilSnapMethods.fil_getPublicKey}
   * @returns Hex encoded public key
   * @example
   * ```js
   * const rsp = await adapter.getPublicKey()
   * if (rsp.error) {
   *    throw new Error(rsp.error.message, {cause: rsp.error.data})
   * }
   * const publicKey = hex.decode(rsp.result)
   * ```
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
   * Change the chain
   *
   * @deprecated use {@link changeNetwork} instead and use `getNetworkFromChainId` from 'iso-filecoin/utils'
   * @param chain - Chain to switch to. Can be a chain id (0x13a) or id (314) or network name (mainnet)
   */
  async changeChain(
    chain: string | number
  ): ReturnType<FilSnapMethods['fil_configure']> {
    const network = getNetworkFromChainId(chain)

    if (this.config && this.config.network === network) {
      return { result: this.config, error: null }
    }
    const config = await this.configure({ network })

    if (config.error) {
      return config
    }
    this.config = config.result

    return config
  }
}
