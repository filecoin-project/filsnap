import { Address, Box, Link, Row, Text } from '@metamask/snaps-sdk/jsx'
import { formatBalance } from 'iso-filecoin-synapse'
import { calibration, mainnet } from 'iso-filecoin-synapse/chains'
import {
  decodeFunctionData,
  erc20Abi,
  type Hex,
  isAddressEqual,
  type Address as ViemAddress,
} from 'viem'
import { ErrorBox } from '../components/error.tsx'
import { ListHeader2 } from '../components/header.tsx'
import { FilecoinIcon } from '../components/svg-icon.tsx'
import * as Icons from '../svg/index.tsx'
import type { TransactionInsightsHandler } from '../types.ts'

/**
 * Chain matches
 *
 * @param chainId - The chain ID
 */
function chainMatches(chainId: string): boolean {
  return ['eip155:314159', 'eip155:314'].includes(chainId)
}

/**
 * Contract address matches
 *
 * @param transactionTo - The transaction to address
 */
function contractAddressMatches(
  transactionTo: ViemAddress | undefined
): boolean {
  if (!transactionTo) {
    return false
  }
  return (
    isAddressEqual(transactionTo, mainnet.contracts.usdfc.address) ||
    isAddressEqual(transactionTo, calibration.contracts.usdfc.address)
  )
}

/**
 * `handleUsdfc`
 *
 * @param props - The props containing transaction details and chain ID.
 * @param config - The configuration object.
 * @returns An object containing the `Insights` component or an `ErrorBox` if there's an issue.
 */
export const handleUsdfc: TransactionInsightsHandler = (props) => {
  const { chainId, transaction } = props

  if (
    !chainMatches(chainId) ||
    !contractAddressMatches(transaction.to as ViemAddress)
  ) {
    return null
  }

  try {
    const callData = decodeFunctionData({
      abi: erc20Abi,
      data: transaction.data as Hex,
    })

    return {
      content: (
        <Box>
          <ListHeader2
            icon={Icons.wallet}
            subtitle={
              <Text color="alternative" size="sm">
                Approve Filecoin Pay as spender of your USDFC balance.
              </Text>
            }
            tooltip="ERC20 Approval Parameters"
          >
            USDFC Spender Approval
          </ListHeader2>
          <Row label="Spender" tooltip="Filecoin Pay Address">
            <Link
              href={`https://beryx.io/fil/calibration/address/${callData.args[0] as ViemAddress}`}
            >
              <Address address={callData.args[0] as ViemAddress} />
            </Link>
          </Row>
          <Row label="Amount" tooltip="Amount of USDFC Filecoin Pay can spend">
            <Text>
              {formatBalance({ value: callData.args[1] as bigint })} USDFC
            </Text>
          </Row>
          <Box direction="vertical">
            <Box direction="horizontal">
              <FilecoinIcon />
              <Text color="muted" size="sm">
                Filecoin Pay
              </Text>
            </Box>
            <Text color="muted" size="sm">
              Review{' '}
              <Link href="https://github.com/FilOzone/filecoin-pay">
                source
              </Link>{' '}
              and onchain{' '}
              <Link
                href={`https://beryx.io/fil/calibration/address/${callData.args[0] as ViemAddress}`}
              >
                deployment
              </Link>{' '}
              for more information.
            </Text>
          </Box>
        </Box>
      ),
    }
  } catch (error) {
    const err = error as Error
    return {
      content: <ErrorBox message={err.message} name={err.name} />,
    }
  }
}
