import { FilecoinNumber } from '@glif/filecoin-number/dist'
import type { SnapsGlobalObject } from '@metamask/snaps-types'
import { getKeyPair } from '../filecoin/account.js'
import type { LotusRpcApi } from '../filecoin/types'
import type { Message, MessageGasEstimate, MessageRequest } from '../types.js'

/**
 * Get the gas estimate for a message
 *
 * @param snap - The snap itself
 * @param api - The Lotus RPC API
 * @param messageRequest - The message to estimate gas for
 * @param maxFee - The max fee to pay for the message
 */
export async function estimateMessageGas(
  snap: SnapsGlobalObject,
  api: LotusRpcApi,
  messageRequest: MessageRequest,
  maxFee?: string
): Promise<MessageGasEstimate> {
  const keypair = await getKeyPair(snap)
  const message: Message = {
    ...messageRequest,
    from: keypair.address,
    gasfeecap: '0',
    gaslimit: 0,
    gaspremium: '0',
    method: 0, // code for basic transaction
    nonce: 0, // dummy nonce just for gas calculation
  }
  // set max fee to 0.1 FIL if not set
  const maxFeeAttoFil =
    maxFee == null ? new FilecoinNumber('0.1', 'fil').toAttoFil() : maxFee
  const messageEstimate = await api.gasEstimateMessageGas(
    message,
    { MaxFee: maxFeeAttoFil },
    null
  )
  return {
    gasfeecap: messageEstimate.GasFeeCap,
    gaslimit: messageEstimate.GasLimit,
    gaspremium: messageEstimate.GasPremium,
    maxfee: maxFeeAttoFil,
  }
}
