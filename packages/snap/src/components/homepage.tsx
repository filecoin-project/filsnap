import {
  Box,
  Copyable,
  Divider,
  Heading,
  Image,
  Link,
  Row,
  type SnapComponent,
  Text,
} from '@metamask/snaps-sdk/jsx'
import type { SnapConfig } from '../types'
import { formatFIL } from '../utils'

type HomePageProps = {
  address: string
  accountNumber: number
  balance: string
  config: SnapConfig
  qr: string
}

export const HomePage: SnapComponent<HomePageProps> = ({
  address,
  accountNumber,
  balance,
  config,
  qr,
}) => {
  return (
    <Box>
      <Heading>Account {accountNumber.toString()}</Heading>
      <Image src={qr} />
      <Text>Address:</Text>
      <Copyable value={address} />
      <Row label="Balance:">
        <Text>{formatFIL(balance, config)}</Text>
      </Row>
      <Row label="Network:">
        <Text>{config.network}</Text>
      </Row>
      <Row label="API:">
        <Text>{config.rpc.url}</Text>
      </Row>
      <Divider />
      <Text>
        Visit the <Link href="https://filsnap.dev">companion dapp</Link> to
        manage your account.{' '}
      </Text>
    </Box>
  )
}
