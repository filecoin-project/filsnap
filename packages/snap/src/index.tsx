import {
  type OnHomePageHandler,
  type OnInstallHandler,
  type OnRpcRequestHandler,
  type OnSignatureHandler,
  type OnTransactionHandler,
  type OnTransactionResponse,
  type OnUpdateHandler,
  type OnUserInputHandler,
  UserInputEventType,
} from '@metamask/snaps-sdk'
import { hex } from 'iso-base/rfc4648'

import { filGetAccount, getAccountInfo } from './rpc/get-account'
import type {
  SignMessageParams,
  SignMessageRawParams,
} from './rpc/sign-message'
import { filSign, signMessage, signMessageRaw } from './rpc/sign-message'
import { State } from './state'
import type {
  Config,
  HomepageContext,
  Network,
  SnapConfig,
  SnapContext,
} from './types'
import { configFromNetwork, serializeError } from './utils'

import { getAccountSafe } from './account'
import { INTERNAL_CONFIG } from './constants'
import {
  configure,
  filChangeNetwork,
  filDeriveAccount,
  filGetConfig,
  filSetConfig,
} from './rpc/configure'
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
import { handleBaseSignature } from './insights/base-signature'
import { handleFilFowarder } from './insights/filforwarder'

export type {
  AccountInfo,
  FilSnapMethods,
  Network,
  SnapConfig,
  Snap,
  SnapError,
  SnapResponse,
  SnapResponseError,
} from './types'

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
      case 'fil_deriveAccount': {
        return await filDeriveAccount(
          context,
          request.params as { index: number }
        )
      }
      case 'fil_changeNetwork': {
        return await filChangeNetwork(
          context,
          request.params as { network: Network }
        )
      }
      case 'fil_getConfig': {
        return await filGetConfig(context)
      }
      case 'fil_setConfig': {
        return await filSetConfig(context, request.params as Config)
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

      case 'fil_sign': {
        return await filSign(context, request.params as { data: string })
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

/**
 * Handle transaction insights.
 *
 * @param params - The params including transaction, chainId and transactionOrigin.
 * @param params.transaction - The transaction object.
 * @param params.chainId - The chain ID.
 * @param params.transactionOrigin - The transaction origin.
 * @returns The transaction insights or null.
 */
export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
  transactionOrigin,
}): Promise<OnTransactionResponse | null> => {
  if (!transactionOrigin) {
    return null
  }
  const state = new State(snap)
  const config = await state.get(transactionOrigin)
  if (!config) {
    return null
  }

  const handlers = [handleFilFowarder]

  let result = null
  for (const handler of handlers) {
    result = await handler({ chainId, transaction, transactionOrigin }, config)
    if (result != null) {
      break
    }
  }
  return result
}

/**
 * Handle signature insights.
 *
 * @param params - The params including signature, and signatureOrigin.
 * @param params.signature - The signature object.
 * @param params.signatureOrigin - The signature origin.
 * @returns The signature insights or null.
 */
export const onSignature: OnSignatureHandler = async ({
  signature,
  signatureOrigin,
}) => {
  if (!signatureOrigin) {
    return null
  }
  const state = new State(snap)
  const config = await state.get(signatureOrigin)

  if (!config) {
    return null
  }
  const handlers = [handleBaseSignature]

  let result = null
  for (const handler of handlers) {
    result = await handler({ signature, signatureOrigin }, config)
    if (result != null) {
      break
    }
  }
  return result
}
