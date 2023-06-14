import type { SnapsGlobalObject } from '@metamask/snaps-types'
import * as Schemas from '../schemas.js'

/**
 * Get the messages from the state
 *
 *  @param snap - The snap itself
 */
export async function getMessages(
  snap: SnapsGlobalObject
): Promise<Schemas.MessageStatus[]> {
  const _state = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  })

  const state = Schemas.metamaskState.parse(_state)

  return state.filecoin.messages
}
