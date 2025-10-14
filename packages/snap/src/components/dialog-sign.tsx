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
import type { SnapConfig } from '../types.ts'
import { addressToCaip10, explorerAddressLink } from '../utils.ts'
import { Header } from './header.tsx'
import { SendReview } from './homepage-send.tsx'
import { Spacer } from './spacer.tsx'
import { SvgIcon } from './svg-icon.tsx'

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
        account={accountNumber.toString()}
        config={config}
        message={message}
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
        <Box alignment="center" direction="horizontal">
          <Text color="alternative">
            This site is requesting a signature for:
          </Text>
        </Box>
        <Box direction="horizontal">
          <SvgIcon color="alternative" icon={iconText} />
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
          <SvgIcon color="alternative" icon={iconWallet} />
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
