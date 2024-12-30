import type {
  OnHomePageHandler,
  OnInstallHandler,
  OnRpcRequestHandler,
  OnUpdateHandler,
} from '@metamask/snaps-sdk'
import encodeQR from '@paulmillr/qr'
import { hex } from 'iso-base/rfc4648'
import { RPC } from 'iso-filecoin/rpc'

import { getAccountInfo } from './rpc/get-account'
import type {
  SignMessageParams,
  SignMessageRawParams,
} from './rpc/sign-message'
import { signMessage, signMessageRaw } from './rpc/sign-message'
import { State } from './state'
import type { SnapConfig, SnapContext } from './types'
import { configFromNetwork, serializeError } from './utils'

import { getAccountSafe } from './account'
import { INTERNAL_CONFIG } from './constants'
import { configure } from './rpc/configure'
import { exportPrivateKey } from './rpc/export-private-key'
import { type EstimateParams, getGasForMessage } from './rpc/gas-for-message'
import { getBalance } from './rpc/get-balance'
import { type SignedMessage, sendMessage } from './rpc/send-message'

import { ErrorBox } from './components/error'
import { HomePage } from './components/homepage'
import { OnInstall } from './components/on-install'
import { OnUpdate } from './components/on-update'

export type {
  AccountInfo,
  FilSnapMethods,
  Network,
  SnapConfig,
  Snap,
  SnapError,
} from './types'

// Disable transaction insight for now
export { onTransaction } from './transaction-insight'

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  try {
    const state = new State(snap)
    const context: SnapContext = {
      snap,
      origin,
      state,
    }

    switch (request.method) {
      case 'fil_configure': {
        return await configure(context, request.params as Partial<SnapConfig>)
      }
      case 'fil_getAccountInfo': {
        return await getAccountInfo(context)
      }
      case 'fil_getAddress': {
        const config = await state.get(origin)

        if (config == null) {
          return serializeError(
            `No configuration found for ${origin}. Connect to Filsnap first.`
          )
        }

        const account = await getAccountSafe(snap, config)
        return { result: account.address.toString() }
      }
      case 'fil_getPublicKey': {
        const config = await state.get(origin)

        if (config == null) {
          return serializeError(
            `No configuration found for ${origin}. Connect to Filsnap first.`
          )
        }

        const account = await getAccountSafe(snap, config)
        return { result: hex.encode(account.pubKey) }
      }
      case 'fil_exportPrivateKey': {
        return await exportPrivateKey(context)
      }
      case 'fil_getBalance': {
        return await getBalance(context)
      }
      case 'fil_signMessage': {
        return await signMessage(context, request.params as SignMessageParams)
      }
      case 'fil_signMessageRaw': {
        return await signMessageRaw(
          context,
          request.params as SignMessageRawParams
        )
      }

      case 'fil_sendMessage': {
        return await sendMessage(context, request.params as SignedMessage)
      }
      case 'fil_getGasForMessage': {
        return await getGasForMessage(context, request.params as EstimateParams)
      }
      default: {
        return serializeError(
          `Unsupported RPC method: "${request.method}" failed`
        )
      }
    }
  } catch (error) {
    const err = error as Error

    return serializeError(`RPC method "${request.method}" failed`, err)
  }
}

export const onInstall: OnInstallHandler = async () => {
  const config = configFromNetwork('mainnet')
  const state = new State(snap)
  await state.set(INTERNAL_CONFIG, config)

  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: <OnInstall />,
    },
  })
}

export const onUpdate: OnUpdateHandler = async () => {
  const config = configFromNetwork('mainnet')
  const state = new State(snap)

  if (!(await state.has(INTERNAL_CONFIG))) {
    await state.set(INTERNAL_CONFIG, config)
  }

  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: <OnUpdate />,
    },
  })
}

/**
 * Handle incoming home page requests from the MetaMask clients.
 *
 * @returns A static panel rendered with custom UI.
 * @see https://docs.metamask.io/snaps/reference/exports/#onhomepage
 */
export const onHomePage: OnHomePageHandler = async () => {
  const state = new State(snap)
  const config = await state.get(INTERNAL_CONFIG)

  if (config === undefined) {
    return {
      content: <ErrorBox name={'Error no config!'} />,
    }
  }

  const account = await getAccountSafe(snap, config)
  let qr = encodeQR(account.address.toString(), 'svg')

  qr = qr.replace(
    'version="1.1"',
    'version="1.1" style="background-color:white; width:20px; height:20px;"'
  )

  const rpc = new RPC({
    api: config.rpc.url,
    network: config.network,
  })
  const balance = await rpc.balance(account.address.toString())
  if (balance.error != null) {
    return {
      content: <ErrorBox name={`Error calling RPC ${balance.error.message}`} />,
    }
  }
  return {
    content: (
      <HomePage
        address={account.address.toString()}
        accountNumber={account.accountNumber}
        balance={balance.result}
        config={config}
        qr={qr}
      />
    ),
  }
}
