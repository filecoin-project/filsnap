import type { Signature } from '@metamask/snaps-sdk'
import { Address, Box, Link, Row, Text } from '@metamask/snaps-sdk/jsx'
import { formatBalance } from 'iso-filecoin-synapse'
import { getChain } from 'iso-filecoin-synapse/chains'
import type { TypedDataDefinition, Address as ViemAddress } from 'viem'
import { ListHeader2 } from '../../components/header.tsx'
import { FilecoinIcon } from '../../components/svg-icon.tsx'
import * as Icons from '../../svg/index.tsx'
import type { SignatureInsightsHandler } from '../../types.ts'

function shouldSkip(signature: Signature): boolean {
  const data = signature.data as TypedDataDefinition
  if (signature.signatureMethod !== 'eth_signTypedData_v4') {
    return false
  }
  if (!data.domain) {
    return false
  }

  const { domain, primaryType, message } = data

  const chainId = data.domain.chainId as number
  const chain = getChain(chainId)

  if (domain.verifyingContract !== chain.contracts.usdfc.address) {
    return false
  }

  if (primaryType !== 'Permit') {
    return false
  }

  if (message.spender !== chain.contracts.payments.address) {
    return false
  }

  return true
}

/**
 * Handles the synapse deposit permit insights.
 *
 * @param props - The props passed to the handler.
 * @param config - The configuration object.
 * @returns A promise that resolves to an object containing the content to display.
 */
export const handleSynapseDepositPermit: SignatureInsightsHandler = (props) => {
  const { signature } = props
  const { message, domain } = signature.data as TypedDataDefinition

  const chainId = domain?.chainId as number

  if (shouldSkip(signature)) {
    return null
  }

  const chain = getChain(chainId)
  const { value, spender } = message

  return {
    content: (
      <Box>
        <ListHeader2
          icon={Icons.signature}
          subtitle={
            <Text color="alternative" size="sm">
              Approve Filecoin Pay as spender of your USDFC balance.
            </Text>
          }
          tooltip="Spending Permit for Filecoin Pay"
        >
          Spending Permit
        </ListHeader2>
        <Row label="Spender" tooltip="Filecoin Pay">
          <Link
            href={`${chain.blockExplorers?.default.url}/address/${spender as ViemAddress}`}
          >
            <Address address={spender as ViemAddress} />
          </Link>
        </Row>
        <Row label="Amount" tooltip="Amount Filecoin Pay is allowed to spend">
          <Text>{formatBalance({ value: BigInt(value as number) })} USDFC</Text>
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
            <Link href="https://github.com/FilOzone/filecoin-pay">source</Link>{' '}
            and onchain{' '}
            <Link
              href={`${chain.blockExplorers?.default.url}/address/${spender as ViemAddress}`}
            >
              deployment
            </Link>{' '}
            for more information.
          </Text>
        </Box>
      </Box>
    ),
  }
}
