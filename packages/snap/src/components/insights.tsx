import {
  Address,
  Box,
  Heading,
  Link,
  Row,
  type SnapComponent,
  Text,
} from '@metamask/snaps-sdk/jsx'
import * as Icons from '../svg'
import type { SnapConfig } from '../types'
import { addressToCaip10, explorerAddressLink, formatFIL } from '../utils'
import { ListHeader } from './header'

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
      <Text color="alternative">
        The FilForwarder smart contract enables FEVM users to send their FIL
        safely and securely to other addresses in the Filecoin ecosystem. Review
        the <Link href="https://github.com/FilOzone/FilForwarder">source</Link>{' '}
        and onchain{' '}
        <Link href="https://beryx.io/fil/mainnet/address/f410ffm7pnedefg2ybn5sbag6lsujhpbifqrfspbcqna">
          deployment
        </Link>{' '}
        for more information.
      </Text>
      <ListHeader icon={Icons.settings} tooltip="FilForwarder call parameters">
        Details
      </ListHeader>
      <Row label="Recipient" tooltip="Recipient's address in robust format">
        <Link href={explorerAddressLink(address, 'testnet')}>
          <Address address={addressToCaip10(address)} />
        </Link>
      </Row>
      <Row label="Amount" tooltip="Amount of FIL your sending to the recipient">
        <Text>{formatFIL(amount, config)}</Text>
      </Row>
    </Box>
  )
}
