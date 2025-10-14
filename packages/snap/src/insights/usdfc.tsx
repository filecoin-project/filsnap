import { Address, Box, Link, Row, Text } from '@metamask/snaps-sdk/jsx'
import { formatBalance } from 'iso-filecoin-synapse'
import { calibration, mainnet } from 'iso-filecoin-synapse/chains'
import type { Chain } from 'iso-filecoin-synapse/types'
import {
  decodeFunctionData,
  type Hex,
  isAddressEqual,
  type Address as ViemAddress,
} from 'viem'
import { ErrorBox } from '../components/error.tsx'
import { ListHeader2 } from '../components/header.tsx'
import { FilecoinIcon } from '../components/svg-icon.tsx'
import * as Icons from '../svg/index.tsx'
import type { TransactionInsightsHandler } from '../types.ts'

function caipToChain(caip: string): Chain | undefined {
  if (caip === 'eip155:314159') {
    return calibration
  }
  if (caip === 'eip155:314') {
    return mainnet
  }
  return undefined
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

  const chain = caipToChain(chainId)

  if (!chain) {
    return null
  }

  if (
    !isAddressEqual(
      transaction.to as ViemAddress,
      chain.contracts.payments.address
    )
  ) {
    return null
  }

  try {
    const callData = decodeFunctionData({
      abi: chain.contracts.payments.abi,
      data: transaction.data as Hex,
    })

    if (callData.functionName !== 'depositWithPermitAndApproveOperator') {
      return null
    }

    console.log(
      '🚀 ~ handleUsdfc ~ callData:',
      callData.functionName,
      callData.args
    )

    return {
      content: (
        <Box>
          <ListHeader2
            icon={Icons.wallet}
            subtitle={
              <Text color="alternative" size="sm">
                Deposit USDFC to Filecoin Pay account and approve Storage
                Service.
              </Text>
            }
          >
            Deposit Request
          </ListHeader2>
          <Row label="Recipient" tooltip="Filecoin Pay">
            <Link
              href={`${chain.blockExplorers?.default.url}/address/${transaction.to as ViemAddress}`}
            >
              <Address address={transaction.to as ViemAddress} />
            </Link>
          </Row>
          <Row label="Amount" tooltip="Amount of USDFC to deposit">
            <Text>
              {formatBalance({ value: BigInt(callData.args[2]) })} USDFC
            </Text>
          </Row>
          <Row label="Service" tooltip="Filecoin Warm Storage Service">
            <Link
              href={`${chain.blockExplorers?.default.url}/address/${callData.args[7] as ViemAddress}`}
            >
              <Address address={callData.args[7] as ViemAddress} />
            </Link>
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
                href={`${chain.blockExplorers?.default.url}/address/${transaction.to as ViemAddress}`}
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
