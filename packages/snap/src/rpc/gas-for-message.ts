import * as Address from 'iso-filecoin/address'
import { Schemas } from 'iso-filecoin/message'
import { RPC } from 'iso-filecoin/rpc'
import { z } from 'zod'
import { getAccountSafe } from '../account.ts'
import type { SnapContext, SnapResponse } from '../types.ts'
import { serializeError, serializeValidationError } from '../utils.ts'

// Default max fee in attoFIL (0.1 FIL)
const DEFAULT_MAX_FEE = '100000000000000000'
// Schemas
export const estimateParams = z.object({
  /**
   * Message to estimate gas for
   */
  message: Schemas.messagePartial.omit({ from: true }),
  /**
   * Max fee in attoFIL
   *
   * @default 100000000000000000 - 0.1 FIL
   */
  maxFee: z.string().optional().describe('Max fee in attoFIL'),
})

// Types
export type EstimateParams = z.infer<typeof estimateParams>
export interface GasForMessageRequest {
  method: 'fil_getGasForMessage'
  params: EstimateParams
}
export interface MessageGasEstimate {
  /**
   * GasFeeCap is the maximum price that the message sender is willing to pay per unit of gas (measured in attoFIL/gas unit). Together with the GasLimit, the GasFeeCap is setting the maximum amount of FIL that a sender will pay for a message: a sender is guaranteed that a message will never cost them more than GasLimit * GasFeeCap attoFIL (not including any Premium that the message includes for its recipient).
   */
  gasFeeCap: string
  /**
   * GasLimit is measured in units of gas and set by the message sender. It imposes a hard limit on the amount of gas (i.e., number of units of gas) that a message’s execution should be allowed to consume on chain.
   */
  gasLimit: number
  /**
   * GasPremium is the price per unit of gas (measured in attoFIL/gas) that the message sender is willing to pay (on top of the BaseFee) to “tip” the miner that will include this message in a block.
   */
  gasPremium: string
}

export type GasForMessageResponse = SnapResponse<MessageGasEstimate>

/**
 * Get the gas estimate for a message
 *
 * @param ctx - Snap context
 * @param params - Estimate params
 */
export async function getGasForMessage(
  ctx: SnapContext,
  params: EstimateParams
): Promise<GasForMessageResponse> {
  const { state } = ctx
  const config = await state.get(ctx.origin)
  if (config == null) {
    return serializeError(
      `No configuration found for ${ctx.origin}. Connect to Filsnap first.`
    )
  }
  const _params = estimateParams.safeParse(params)
  if (!_params.success) {
    return serializeValidationError(_params.error)
  }

  const { message, maxFee } = _params.data

  const account = await getAccountSafe(snap, config)
  const rpc = new RPC({
    api: config.rpc.url,
    network: config.network,
  })
  const msg = {
    to: Address.from(message.to, config.network).toString(),
    from: account.address.toString(),
    value: message.value,
  }

  const { error, result } = await rpc.gasEstimate({
    msg,
    maxFee: maxFee ?? DEFAULT_MAX_FEE,
  })

  if (error != null) {
    return serializeError(`RPC call to "GasEstimateMessageGas" failed`, error)
  }

  return {
    error: null,
    result: {
      gasFeeCap: result.GasFeeCap,
      gasLimit: result.GasLimit,
      gasPremium: result.GasPremium,
    },
  }
}
