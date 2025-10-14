import {
  Address,
  Box,
  Copyable,
  Link,
  Row,
  Section,
  type SnapComponent,
  Text,
} from '@metamask/snaps-sdk/jsx'
import iconDownload from '../svg/download.svg'
import iconKey from '../svg/key.svg'
import iconWallet from '../svg/wallet.svg'
import type { SnapConfig } from '../types.ts'
import { addressToCaip10, explorerAddressLink } from '../utils.ts'
import { Header, ListHeader } from './header.tsx'

type ExportConfirmProps = {
  address: string
  accountNumber: number
  origin: string
  config: SnapConfig
}

export const ExportConfirm: SnapComponent<ExportConfirmProps> = ({
  address,
  accountNumber,
  config,
  origin,
}) => {
  return (
    <Box>
      <Header icon={iconDownload} iconColor="warning" sub={`from ${origin}`}>
        Private Key Export Request
      </Header>
      <Section>
        <Box alignment="center" direction="horizontal">
          <Text color="alternative">
            This site is requesting a private key export for:
          </Text>
        </Box>
        <ListHeader
          icon={iconWallet}
          tooltip="Account to export the private key for"
        >
          Account
        </ListHeader>
        <Row label="Name" tooltip="Account's name">
          <Text color="alternative">Account {accountNumber.toString()}</Text>
        </Row>
        <Row label="Address" tooltip="Account's address in robust format">
          <Link href={explorerAddressLink(address, config.network)}>
            <Address address={addressToCaip10(address)} />
          </Link>
        </Row>
      </Section>
    </Box>
  )
}

type PrivateKeyExportProps = {
  privateKey: string
  lotusPrivateKey: string
}

export const PrivateKeyExport: SnapComponent<PrivateKeyExportProps> = ({
  privateKey,
  lotusPrivateKey,
}) => {
  return (
    <Box>
      <Header icon={iconKey} iconColor="error" sub="Never disclose this key">
        Private Key
      </Header>
      <Section>
        <Box alignment="center" direction="horizontal">
          <Text color="alternative">
            Warning: Anyone with your private keys can steal any assets held in
            your account. Do not share this with anyone.
          </Text>
        </Box>

        <Text color="alternative"> Raw base64 encoded private key:</Text>
        <Copyable sensitive value={privateKey} />
        <Text color="alternative"> Lotus hex encoded private key:</Text>
        <Copyable sensitive value={lotusPrivateKey} />
      </Section>
    </Box>
  )
}
