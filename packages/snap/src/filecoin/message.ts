import type { SnapsGlobalObject } from '@metamask/snaps-types'
import * as Schemas from '../schemas.js'

// TODO - should this update the message or just add a new one? if it the same CID it should be the same message

/**
 * Update the messages in the state
 *
 * @param snap - The snap itself
 * @param message - The message to update
 */
export async function updateMessageInState(
  snap: SnapsGlobalObject,
  message: Schemas.MessageStatus
): Promise<void> {
  const _state = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  })

  const state = Schemas.metamaskState.parse(_state)

  const index = state.filecoin.messages.findIndex(
    (msg) => msg.cid === message.cid
  )
  if (index >= 0) {
    state.filecoin.messages[index] = message
  } else {
    state.filecoin.messages.push(message)
  }
  await snap.request({
    method: 'snap_manageState',
    params: { newState: state, operation: 'update' },
  })
}
