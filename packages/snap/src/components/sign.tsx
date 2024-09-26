import {
  Bold,
  Box,
  Copyable,
  Heading,
  Row,
  type SnapComponent,
  Text,
} from '@metamask/snaps-sdk/jsx'
import type { Message } from 'iso-filecoin/message'
import { Token } from 'iso-filecoin/token'
import type { Jsonify } from 'type-fest'
import type { SnapConfig } from '../types'
import { formatFIL } from '../utils'

type SignMessageDialogProps = {
  origin: string
  accountNumber: number
  message: Jsonify<Message>
  config: SnapConfig
}

export const SignMessageDialog: SnapComponent<SignMessageDialogProps> = ({
  accountNumber,
  message,
  config,
  origin,
}) => {
  const gas = Token.fromAttoFIL(message.gasPremium).mul(message.gasLimit)
  const total = Token.fromAttoFIL(message.value).add(gas)

  return (
    <Box>
      <Heading>Signature Request from {origin}</Heading>
      <Row label="Send">
        <Text>
          <Bold>{formatFIL(message.value, config)}</Bold>
        </Text>
      </Row>
      <Row
        label="From"
        tooltip={`Account
        ${accountNumber.toString()}`}
      >
        <Text>{message.from}</Text>
      </Row>
      <Row label="To">
        <Text>{message.to}</Text>
      </Row>
      <Heading>Details</Heading>
      <Row label="Gas" tooltip="Estimated gas">
        <Text>{formatFIL(gas, config)}</Text>
      </Row>

      <Row label="Total" tooltip="Estimated total (amount + gas)">
        <Text>{formatFIL(total, config)}</Text>
      </Row>
      <Row label="API">
        <Text> {config.rpc.url}</Text>
      </Row>
      <Row label="Network">
        <Text> {config.network}</Text>
      </Row>
    </Box>
  )
}

type SignRawDialogProps = {
  origin: string
  accountNumber: number
  message: string
}

export const SignRawDialog: SnapComponent<SignRawDialogProps> = ({
  accountNumber,
  origin,
  message,
}) => {
  return (
    <Box>
      <Heading>Signature Request from {origin}</Heading>
      <Text>
        Do you want to sign the message below with{' '}
        <Bold>Account {accountNumber.toString()}</Bold>?
      </Text>
      <Copyable value={message} />
    </Box>
  )
}
