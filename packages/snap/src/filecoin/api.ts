import {
  NodejsProvider,
  type ProviderOptions,
  // @ts-expect-error - no types
} from '@filecoin-shipyard/lotus-client-provider-nodejs'
import { LotusRPC } from '@filecoin-shipyard/lotus-client-rpc'
// @ts-expect-error - no types
import { testnet } from '@filecoin-shipyard/lotus-client-schema'
import { type SnapConfig } from '../types.js'
import { type LotusRpcApi } from './types.js'

/**
 * Get RPC API client
 *
 * @param configuration - Snap configuration
 * @returns LotusRpcApi
 */
export function getApiFromConfig(configuration: SnapConfig): LotusRpcApi {
  const options: ProviderOptions = {}
  if (configuration.rpc.token.length > 0) {
    options.token = configuration.rpc.token
  }
  options.sendHttpContentType = 'application/json'
  const provider = new NodejsProvider(configuration.rpc.url, options)
  const client = new LotusRPC(provider, { schema: testnet.fullNode })
  return client as unknown as LotusRpcApi
}
