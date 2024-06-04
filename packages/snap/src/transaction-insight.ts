import type {
  OnTransactionHandler,
  OnTransactionResponse,
} from '@metamask/snaps-sdk'
import { heading, panel, text } from '@metamask/snaps-sdk'
import * as Address from 'iso-filecoin/address'
import { Token } from 'iso-filecoin/token'
import { type Hex, fromHex } from 'viem'
import { decodeFunctionData } from 'viem'
import { filForwarderMetadata } from './filforwarder'

/**
 * Invalid transfer message
 *
 * @param message - The message to display
 */
function invalidTransferMessage(message: string): OnTransactionResponse {
  return {
    content: panel([heading('Invalid FIL Transfer'), text(message)]),
  }
}

/**
 * Human readable network
 *
 * @param chainId - The chain ID
 */
function humanReadableNetwork(chainId: string): string {
  if (chainId === filForwarderMetadata.chainIds.filecoinMainnet) {
    return 'Filecoin Mainnet'
  }
  if (chainId === filForwarderMetadata.chainIds.filecoinCalibrationTestnet) {
    return 'Filecoin Calibration Testnet'
  }
  throw new Error(`Unknown chain ID: ${chainId}`)
}

/**
 * Chain matches
 *
 * @param chainId - The chain ID
 */
function chainMatches(chainId: string): boolean {
  return Object.values(filForwarderMetadata.chainIds).includes(chainId)
}

/**
 * Contract address matches
 *
 * @param transactionTo - The transaction to address
 */
function contractAddressMatches(transactionTo: string | undefined): boolean {
  return (
    transactionTo?.toLowerCase() ===
    filForwarderMetadata.contractAddress.toLowerCase()
  )
}

// Note: currently MetaMask shows the transaction insight tab by default even if we don't display any information
// in it. This is a bug that the MetaMask team is addressing in this PR:
// https://github.com/MetaMask/metamask-extension/pull/20267
export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}): Promise<OnTransactionResponse | null> => {
  if (
    !chainMatches(chainId) ||
    !contractAddressMatches(transaction.to as string | undefined)
  ) {
    // Don't show any insights if the transaction is not a FIL transfer.
    return null
  }

  let transferAmount: Token
  try {
    transferAmount = new Token(fromHex(transaction.value as Hex, 'bigint'))
  } catch (error) {
    console.error(error)
    return invalidTransferMessage(
      'Transfer amount is missing from the transaction.'
    )
  }

  let recipient: Address.IAddress
  try {
    const callData = decodeFunctionData({
      abi: filForwarderMetadata.abi,
      data: transaction.data as Hex,
    })
    if (callData.functionName !== 'forward') {
      return invalidTransferMessage('Transaction tries to call wrong method.')
    }
    if (callData.args === undefined || callData.args.length !== 1) {
      return invalidTransferMessage('Missing recipient in transaction.')
    }

    const isMainNet = chainId === filForwarderMetadata.chainIds.filecoinMainnet
    recipient = Address.fromContractDestination(
      callData.args[0] as Hex,
      isMainNet ? 'mainnet' : 'testnet'
    )
  } catch (error) {
    console.error(error)
    return invalidTransferMessage('Transaction recipient is invalid.')
  }

  return {
    content: panel([
      heading('Transfer FIL'),
      text(
        `You are transferring ${transferAmount
          .toFIL()
          .toString()} FIL to ${recipient.toString()} on ${humanReadableNetwork(
          chainId
        )}`
      ),
    ]),
  }
}
