import type { SnapsGlobalObject } from '@metamask/snaps-types'
import { panel, text, heading, copyable } from '@metamask/snaps-ui'

interface ConfirmationDialogContent {
  prompt: string
  description?: string
  textAreaContent?: string
}

/**
 * Show a confirmation dialog to the user
 *
 * @see https://docs.metamask.io/snaps/reference/rpc-api/#confirmation-dialog
 * @param snap - The snap itself
 * @param message - The message to show
 */
export async function showConfirmationDialog(
  snap: SnapsGlobalObject,
  message: ConfirmationDialogContent
): Promise<boolean> {
  return (await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading(message.prompt),
        text(message.description ?? ''),
        copyable(message.textAreaContent ?? ''),
      ]),
    },
  })) as boolean
}
