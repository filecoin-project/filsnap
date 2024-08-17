import {
  type OnHomePageHandler,
  type OnInstallHandler,
  type OnRpcRequestHandler,
  copyable,
  divider,
  heading,
  image,
  panel,
  row,
  text,
} from '@metamask/snaps-sdk'

import { RPC } from 'iso-filecoin/rpc'

import encodeQR from '@paulmillr/qr'
import { hex } from 'iso-base/rfc4648'
import { configure } from './rpc/configure'
import { exportPrivateKey } from './rpc/export-private-key'
import { type EstimateParams, getGasForMessage } from './rpc/gas-for-message'
import { getBalance } from './rpc/get-balance'
import { type SignedMessage, sendMessage } from './rpc/send-message'

import { Token } from 'iso-filecoin/token'
import { parseDerivationPath } from 'iso-filecoin/utils'
import { getAccountSafe } from './account'
import { INTERNAL_CONFIG } from './constants'
import { getAccountInfo } from './rpc/get-account'
import type {
  SignMessageParams,
  SignMessageRawParams,
} from './rpc/sign-message'
import { signMessage, signMessageRaw } from './rpc/sign-message'
import { State } from './state'
import type { SnapConfig, SnapContext } from './types'
import { configFromNetwork, serializeError } from './utils'

export type {
  AccountInfo,
  FilSnapMethods,
  Network,
  RequestWithFilSnap,
  SnapConfig,
  Snap,
} from './types'

// Disable transaction insight for now
// export { onTransaction } from './transaction-insight'

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
  const config = configFromNetwork('testnet')
  const state = new State(snap)
  await state.set(INTERNAL_CONFIG, config)

  await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: panel([
        heading('Installation successful 🎉'),
        text(
          'Your MetaMask wallet now has support for Filecoin, and you can start using it!'
        ),
        text('Visit the [companion dapp](https://filsnap.dev) to get started.'),
      ]),
    },
  })
}

// export const onUpdate: OnUpdateHandler = async () => {
//   await snap.request({
//     method: 'snap_dialog',
//     params: {
//       type: 'alert',
//       content: panel([
//         heading('Update successful'),
//         text('New features added in this version:'),
//         text('Added a dialog that appears when updating.'),
//         image(
//           '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 40 40" xml:space="preserve" enable-background="new 0 0 40 40"><style>.st1-logo{fill-rule:evenodd;clip-rule:evenodd;fill:#fff}</style><defs><filter id="a-logo" filterUnits="userSpaceOnUse" x="0" y="0" width="40" height="40"><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"/></filter></defs><mask maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40" id="b-logo_1"><g filter="url(#a-logo)"><path id="a-logo_1" class="st1-logo" d="M0 0h40v40H0V0z"/></g></mask><path d="M20 40C9 40 0 31 0 19.9.1 8.9 9-.1 20.1 0 31.1.1 40 9 40 20.2 39.9 31.1 31 40 20 40" mask="url(#b-logo_1)" fill-rule="evenodd" clip-rule="evenodd" fill="#0090ff"/><path class="st1-logo" d="m21.9 17.6-.6 3.2 5.7.8-.4 1.5-5.6-.8c-.4 1.3-.6 2.7-1.1 3.9-.5 1.4-1 2.8-1.6 4.1-.8 1.7-2.2 2.9-4.1 3.2-1.1.2-2.3.1-3.2-.6-.3-.2-.6-.6-.6-.9 0-.4.2-.9.5-1.1.2-.1.7 0 1 .1.3.3.6.7.8 1.1.6.8 1.4.9 2.2.3.9-.8 1.4-1.9 1.7-3 .6-2.4 1.2-4.7 1.7-7.1v-.4l-5.3-.8.2-1.5 5.5.8.7-3.1-5.7-.9.2-1.6 5.9.8c.2-.6.3-1.1.5-1.6.5-1.8 1-3.6 2.2-5.2 1.2-1.6 2.6-2.6 4.7-2.5.9 0 1.8.3 2.4 1 .1.1.3.3.3.5 0 .4 0 .9-.3 1.2-.4.3-.9.2-1.3-.2-.3-.3-.5-.6-.8-.9-.6-.8-1.5-.9-2.2-.2-.5.5-1 1.2-1.3 1.9-.7 2.1-1.2 4.3-1.9 6.5l5.5.8-.4 1.5-5.3-.8"/></svg>'
//         ),
//       ]),
//     },
//   })
// }

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
      content: panel([text('Error no config!')]),
    }
  }

  const account = await getAccountSafe(snap, config)
  const { account: accountNumber } = parseDerivationPath(config.derivationPath)
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
      content: panel([text(`Error calling RPC ${balance.error.message}`)]),
    }
  }

  return {
    content: panel([
      heading(`Account ${accountNumber}`),
      image(qr),
      text('Address:'),
      copyable(`${account.address.toString()}`),
      row(
        'Balance:',
        text(`${Token.fromAttoFIL(balance.result).toFIL().toFormat()} FIL`)
      ),
      row('Network:', text(config.network)),
      row('API:', text(config.rpc.url)),
      divider(),
      text(
        'Visit the [companion dapp](https://filsnap.dev) to manage your account.'
      ),
    ]),
  }
}
