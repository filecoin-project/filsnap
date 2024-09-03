import type {
  GetSnapsParams,
  JsonRpcError,
  JsonRpcRequest,
  Snap,
  SnapMethods,
} from '@metamask/snaps-sdk'
import type { FilSnapMethods } from 'filsnap'
import type { AddEthereumChainParameter, WalletPermission } from 'viem'

/**
 * Snaps Provider request types
 *
 * @see https://github.com/MetaMask/snaps/blob/main/packages/snaps-sdk/src/types/methods/methods.ts
 */

export type Method<
  MethodName extends string,
  Params,
> = Partial<JsonRpcRequest> & Params extends never
  ? {
      method: MethodName
    }
  : {
      method: MethodName
      params: Params
    }

/**
 * Patched GetSnapsResult
 */
type GetSnapsResult = Record<
  string,
  | {
      error: JsonRpcError
    }
  | Snap
  | undefined
>

/**
 * viem types
 * https://github.com/wevm/viem/blob/main/src/types/eip1193.ts#L1519
 */
export type CustomSnapsMethods = SnapMethods & {
  wallet_getSnaps: [GetSnapsParams, GetSnapsResult]
  wallet_switchEthereumChain: [[{ chainId: string }], null]
  wallet_addEthereumChain: [[AddEthereumChainParameter], null]
  wallet_requestPermissions: [
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    [{ eth_accounts: Record<string, any> }],
    WalletPermission[],
  ]
  wallet_revokePermissions: [
    [
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      | { eth_accounts: Record<string, any> }
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      | { wallet_snap: Record<string, any> },
    ],
    null,
  ]
  wallet_getPermissions: [never, WalletPermission[]]
  eth_requestAccounts: [never, string[]]
  eth_chainId: [never, string]
  eth_accounts: [never, string[]]
}

export type RequestWithFilSnap = <
  MethodName extends keyof CustomSnapsMethods,
  SnapMethod extends keyof FilSnapMethods = keyof FilSnapMethods,
>(
  args: MethodName extends 'wallet_invokeSnap'
    ? {
        method: MethodName
        params: {
          request: Parameters<FilSnapMethods[SnapMethod]>[1] extends undefined
            ? {
                method: SnapMethod
              }
            : {
                method: SnapMethod
                params: Parameters<FilSnapMethods[SnapMethod]>[1]
              }
          snapId: string
        }
      }
    : Method<MethodName, CustomSnapsMethods[MethodName][0]>
) => MethodName extends 'wallet_invokeSnap'
  ? ReturnType<FilSnapMethods[SnapMethod]>
  : Promise<CustomSnapsMethods[MethodName][1]>

export type ProviderConnectInfo = {
  chainId: string
}

export type ProviderMessage = {
  type: string
  data: unknown
}

export type EIP1193EventMap = {
  accountsChanged(accounts: `0x${string}`[]): void
  chainChanged(chainId: string): void
  connect(connectInfo: ProviderConnectInfo): void
  disconnect(error: Error & { code: number; details: string }): void
  message(message: ProviderMessage): void
}

export type EIP1193Events = {
  on<event extends keyof EIP1193EventMap>(
    event: event,
    listener: EIP1193EventMap[event]
  ): void
  removeListener<event extends keyof EIP1193EventMap>(
    event: event,
    listener: EIP1193EventMap[event]
  ): void
}

/**
 * EIP-1193 provider
 */
export interface EIP1193Provider extends EIP1193Events {
  isMetaMask: boolean
  isConnected(): boolean
  request: RequestWithFilSnap
}

/**
 * Reverse Domain Name Notation (rDNS) of the Wallet Provider.
 */
export type Rdns =
  | 'io.metamask'
  | 'io.metamask.flask'
  | 'io.metamask.mmi'
  | (string & {})
/**
 * Metadata of the EIP-1193 Provider.
 */
export interface EIP6963ProviderInfo<TRdns extends string = Rdns> {
  icon: `data:image/${string}` // RFC-2397
  name: string
  rdns: TRdns
  uuid: string
}

/**
 * Event detail from the `"eip6963:announceProvider"` event.
 */
export interface EIP6963ProviderDetail<
  TProvider = EIP1193Provider,
  TRdns extends string = Rdns,
> {
  info: EIP6963ProviderInfo<TRdns>
  provider: TProvider
}

/**
 * Event type to announce an EIP-1193 Provider.
 */
export interface EIP6963AnnounceProviderEvent<TProvider = EIP1193Provider>
  extends CustomEvent<EIP6963ProviderDetail<TProvider>> {
  type: 'eip6963:announceProvider'
}

/**
 * Event type to request EIP-1193 Providers.
 */
export interface EIP6963RequestProviderEvent extends Event {
  type: 'eip6963:requestProvider'
}

declare global {
  interface WindowEventMap {
    'eip6963:announceProvider': EIP6963AnnounceProviderEvent
    'eip6963:requestProvider': EIP6963RequestProviderEvent
  }
}
