import {
  Bold,
  Box,
  Copyable,
  Heading,
  Row,
  type SnapComponent,
  Text,
} from '@metamask/snaps-sdk/jsx'
import type { SnapConfig } from '../types'

type ConfigureProps = {
  origin: string
  address: string
  accountNumber: number
  config: SnapConfig
}

export const Configure: SnapComponent<ConfigureProps> = ({
  address,
  origin,
  accountNumber,
  config,
}) => {
  return (
    <Box>
      <Heading>Connection request</Heading>
      <Text>
        <Bold>{origin}</Bold> wants to connect with your Filecoin account.
      </Text>
      <Text>Account {accountNumber.toString()}</Text>
      <Copyable value={address} />
      <Row label="Derivation Path:">
        <Text>{config.derivationPath}</Text>
      </Row>
      <Row label="API:">
        <Text>{config.rpc.url}</Text>
      </Row>
      <Row label="Network:">
        <Text>{config.network}</Text>
      </Row>
      <Row label="Unit Decimals:">
        <Text>{config.unit?.decimals.toString() ?? 'N/A'}</Text>
      </Row>
      <Row label="Unit Symbol:">
        <Text>{config.unit?.symbol ?? 'N/A'}</Text>
      </Row>
    </Box>
  )
}
