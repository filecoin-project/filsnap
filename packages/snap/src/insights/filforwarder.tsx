import * as Address from 'iso-filecoin/address'
import { Token } from 'iso-filecoin/token'
import { type Hex, fromHex } from 'viem'
import { decodeFunctionData } from 'viem'
import { ErrorBox } from '../components/error'
import { Insights } from '../components/insights'
import { filForwarderMetadata } from '../filforwarder'
import type { TransactionInsightsHandler } from '../types'

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

/**
 * `handleFilFowarder` is an `InsightsHandler` implementation that provides insights for FIL forwarder transactions.
 * It checks if the transaction is a FIL transfer on a supported chain and contract address,
 * decodes the transaction data to extract the recipient and transfer amount,
 * and renders an `Insights` component with the extracted information.
 *
 * @param props - The props containing transaction details and chain ID.
 * @param config - The configuration object.
 * @returns An object containing the `Insights` component or an `ErrorBox` if there's an issue.
 */
export const handleFilFowarder: TransactionInsightsHandler = (
  props,
  config
) => {
  const { chainId, transaction } = props

  // Don't show any insights if the transaction is not a FIL transfer.
  if (
    !chainMatches(chainId) ||
    !contractAddressMatches(transaction.to as string | undefined)
  ) {
    return null
  }

  // If no config is provided, don't show any insights.
  if (!config) {
    return null
  }

  try {
    if (!transaction.value) {
      return {
        content: (
          <ErrorBox name={'Transfer amount is missing from the transaction.'} />
        ),
      }
    }

    const callData = decodeFunctionData({
      abi: filForwarderMetadata.abi,
      data: transaction.data as Hex,
    })

    if (callData.functionName !== 'forward') {
      return {
        content: <ErrorBox name={'Transaction tries to call wrong method.'} />,
      }
    }
    if (callData.args === undefined || callData.args.length !== 1) {
      return {
        content: <ErrorBox name={'Missing recipient in transaction.'} />,
      }
    }

    const isMainNet = chainId === filForwarderMetadata.chainIds.filecoinMainnet
    const transferAmount = Token.fromFIL(
      fromHex(transaction.value as Hex, 'bigint')
    )
    const recipient = Address.fromContractDestination(
      callData.args[0] as Hex,
      isMainNet ? 'mainnet' : 'testnet'
    )
    return {
      content: (
        <Insights
          config={config}
          amount={transferAmount.toFIL().toString()}
          address={recipient.toString()}
        />
      ),
    }
  } catch (error) {
    const err = error as Error
    return {
      content: <ErrorBox name={err.name} message={err.message} />,
    }
  }
}
