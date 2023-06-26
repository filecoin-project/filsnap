import * as Schemas from '../schemas'
import type { MessageStatus, SnapContext, SnapResponse } from '../types'
import { serializeError } from '../utils'

export type GetMessagesResponse = SnapResponse<MessageStatus[]>

/**
 * Get the messages from the state
 *
 *  @param ctx - Snaps context
 */
export async function getMessages(
  ctx: SnapContext
): Promise<GetMessagesResponse> {
  const _state = await ctx.snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  })

  const state = Schemas.metamaskState.safeParse(_state)

  if (!state.success) {
    return serializeError(`Invalid messages in snap state`, state.error)
  }

  return { result: state.data.filecoin.messages }
}
