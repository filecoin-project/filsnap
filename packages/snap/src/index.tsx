import {
  type OnHomePageHandler,
  type OnInstallHandler,
  type OnRpcRequestHandler,
  type OnUpdateHandler,
  type OnUserInputHandler,
  UserInputEventType,
} from '@metamask/snaps-sdk'
import { hex } from 'iso-base/rfc4648'

import { getAccountInfo } from './rpc/get-account'
import type {
  SignMessageParams,
  SignMessageRawParams,
} from './rpc/sign-message'
import { signMessage, signMessageRaw } from './rpc/sign-message'
import { State } from './state'
import type { HomepageContext, SnapConfig, SnapContext } from './types'
import { configFromNetwork, serializeError } from './utils'

import { getAccountSafe } from './account'
import { INTERNAL_CONFIG } from './constants'
import { configure, getConfig } from './rpc/configure'
import { exportPrivateKey } from './rpc/export-private-key'
import { type EstimateParams, getGasForMessage } from './rpc/gas-for-message'
import { getBalance } from './rpc/get-balance'
import { type SignedMessage, sendMessage } from './rpc/send-message'

import { updateWithError } from './components/error'
import {
  HomepageEvents,
  createHomepage,
  onNetworkChange,
  updateHomepage,
} from './components/homepage'
import { onReceive } from './components/homepage-receive'
import { onSend, onSendConfirm, onSendResult } from './components/homepage-send'
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
      case 'fil_getConfig': {
        return await getConfig(context)
      }
      case 'fil_configure': {
        return await configure(context, request.params as Partial<SnapConfig>)
      }
      case 'fil_getAccountInfo': {
        return await getAccountInfo(context)
      }
      case 'fil_getAccount': {
        return await filGetAccount(context)
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
  const { ui, context } = await createHomepage()
  const interfaceId = await snap.request({
    method: 'snap_createInterface',
    params: {
      ui,
      context,
    },
  })
  return {
    id: interfaceId,
  }
}

/**
 * Handles user input
 */
export const onUserInput: OnUserInputHandler = async ({
  id,
  event,
  context,
}) => {
  // force context to be object to avoid types issues
  if (context === null) {
    context = {}
  }
  try {
    // Handle homepage events
    if (event.name?.startsWith('homepage')) {
      const ctx = context as HomepageContext
      if (
        event.type === UserInputEventType.InputChangeEvent &&
        event.name === HomepageEvents.changeNetwork
      ) {
        await onNetworkChange(id, event, ctx)
        return
      }

      if (
        event.type === UserInputEventType.ButtonClickEvent &&
        event.name === HomepageEvents.receive
      ) {
        await onReceive(id, ctx)
        return
      }

      if (
        event.type === UserInputEventType.ButtonClickEvent &&
        event.name === HomepageEvents.send
      ) {
        await onSend(id, ctx)
        return
      }
      if (
        event.type === UserInputEventType.ButtonClickEvent &&
        event.name === HomepageEvents.sendConfirm
      ) {
        await onSendConfirm(id, ctx)
        return
      }
      if (
        event.type === UserInputEventType.ButtonClickEvent &&
        event.name === HomepageEvents.sendResult
      ) {
        await onSendResult(id, ctx)
        return
      }
      if (
        event.type === UserInputEventType.ButtonClickEvent &&
        event.name === HomepageEvents.backToSend
      ) {
        await onSend(id, ctx)
        return
      }

      if (
        event.type === UserInputEventType.ButtonClickEvent &&
        event.name === HomepageEvents.back
      ) {
        await updateHomepage(id, ctx)
        return
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      updateWithError(id, context, {
        name: error.name,
        message: error.message,
        back: HomepageEvents.backToSend,
      })
      return
    }
    updateWithError(id, context, {
      name: 'Unknown Error',
      // @ts-expect-error - no types
      message: error.toString(),
      back: HomepageEvents.back,
    })
  }
}
