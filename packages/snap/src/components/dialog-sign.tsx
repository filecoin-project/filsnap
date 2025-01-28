import {
  Address,
  Bold,
  Box,
  Copyable,
  Divider,
  Link,
  Row,
  Section,
  type SnapComponent,
  Text,
  Tooltip,
} from '@metamask/snaps-sdk/jsx'
import type { Message } from 'iso-filecoin/message'
import type { Jsonify } from 'type-fest'
import iconSend from '../svg/send.svg'
import iconSignature from '../svg/signature.svg'
import iconText from '../svg/text.svg'
import iconWallet from '../svg/wallet.svg'
import type { SnapConfig } from '../types'
import { addressToCaip10, explorerAddressLink } from '../utils'
import { Header } from './header'
import { SendReview } from './homepage-send'
import { Spacer } from './spacer'
import { SvgIcon } from './svg-icon'

type SignTransactionDialogProps = {
  origin?: string
  accountNumber: number
  message: Jsonify<Message>
  config: SnapConfig
}

export const SignTransactionDialog: SnapComponent<
  SignTransactionDialogProps
> = ({ accountNumber, message, config, origin }) => {
  return (
    <Box>
      <Header icon={iconSend} sub={`from ${origin}`}>
        Transaction Request
      </Header>
      <SendReview
        message={message}
        config={config}
        account={accountNumber.toString()}
      />
    </Box>
  )
}

type SignMessageDialogProps = {
  origin: string
  address: string
  accountNumber: number
  message: string
}

export const SignMessageDialog: SnapComponent<SignMessageDialogProps> = ({
  accountNumber,
  origin,
  message,
  address,
}) => {
  return (
    <Box>
      <Header icon={iconSignature} sub={`from ${origin}`}>
        Signature Request
      </Header>
      <Section>
        <Box direction="horizontal" alignment="center">
          <Text color="alternative">
            This site is requesting a signature for:
          </Text>
        </Box>
        <Box direction="horizontal">
          <SvgIcon icon={iconText} color="alternative" />
          <Tooltip content="Message to sign">
            <Text color="default">
              <Bold>Message</Bold>
            </Text>
          </Tooltip>
        </Box>
        <Copyable value={message} />
        <Spacer unit={1} />
        <Divider />
        <Spacer unit={1} />
        <Box direction="horizontal">
          <SvgIcon icon={iconWallet} color="alternative" />
          <Tooltip content="Account used to sign the message">
            <Text color="default">
              <Bold>Account</Bold>
            </Text>
          </Tooltip>
        </Box>
        <Row label="Name" tooltip="Account's name">
          <Text color="alternative">Account {accountNumber.toString()}</Text>
        </Row>
        <Row label="Address" tooltip="Account's address in robust format">
          <Link href={explorerAddressLink(address, 'testnet')}>
            <Address address={addressToCaip10(address)} />
          </Link>
        </Row>
      </Section>
    </Box>
  )
}
