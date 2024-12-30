import {
  Bold,
  Box,
  Copyable,
  Divider,
  Heading,
  Icon,
  Link,
  type SnapComponent,
  Text,
} from '@metamask/snaps-sdk/jsx'
import type { SnapConfig } from '../types'
import { formatFIL } from '../utils'

type ErrorBoxProps = {
  config: SnapConfig
  address: string
  amount: string
}
export const Insights: SnapComponent<ErrorBoxProps> = ({
  amount,
  config,
  address,
}) => {
  return (
    <Box>
      <Heading>FilForwarder Transaction</Heading>
      <Text>
        The FilForwarder smart contract enables FEVM users to send their FIL
        safely and securely to other addresses in the Filecoin ecosystem. Review
        the <Link href="https://github.com/FilOzone/FilForwarder">source</Link>{' '}
        and onchain{' '}
        <Link href="https://beryx.io/fil/mainnet/address/f410ffm7pnedefg2ybn5sbag6lsujhpbifqrfspbcqna">
          deployment
        </Link>{' '}
        for more information.
      </Text>
      <Divider />
      <Box direction="horizontal">
        <Icon name="user" size="md" />
        <Text>Recipient</Text>
      </Box>
      <Copyable value={address} />
      <Box direction="horizontal">
        <Text>
          <Bold>⨎</Bold>
        </Text>
        <Text>Amount</Text>
      </Box>
      <Text color="muted">{formatFIL(amount, config)}</Text>
    </Box>
  )
}
