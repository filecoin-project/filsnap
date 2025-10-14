import {
  Address,
  Box,
  Divider,
  Link,
  Row,
  Section,
  type SnapComponent,
  Text,
} from '@metamask/snaps-sdk/jsx'
import * as Chains from 'iso-filecoin/chains'
import iconConnect from '../svg/connect.svg'
import iconSettings from '../svg/settings.svg'
import iconWallet from '../svg/wallet.svg'
import type { SnapConfig } from '../types.ts'
import { addressToCaip10, explorerAddressLink } from '../utils.ts'
import { Header, ListHeader } from './header.tsx'
import { Spacer } from './spacer.tsx'

type ConfigureProps = {
  origin: string
  address: string
  accountNumber: number
  config: SnapConfig
}

export const Configure: SnapComponent<ConfigureProps> = ({
  address,
  origin,
  config,
  accountNumber,
}) => {
  return (
    <Box>
      <Header icon={iconConnect} sub={`from ${origin}`}>
        Connection Request
      </Header>
      <Section>
        <Box alignment="center" direction="horizontal">
          <Text color="alternative">This site is requesting access to:</Text>
        </Box>
        <ListHeader icon={iconWallet} tooltip="Account to be accessed">
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
        <Spacer unit={1} />
        <Divider />
        <Spacer unit={1} />
        <ListHeader icon={iconSettings} tooltip="Configuration for the snap">
          Configuration
        </ListHeader>
        <Row label="Derivation Path">
          <Text color="alternative">{config.derivationPath}</Text>
        </Row>
        <Row label="API">
          <Text color="alternative">{config.rpc.url}</Text>
        </Row>
        <Row label="Network">
          <Text color="alternative">{Chains[config.network].name}</Text>
        </Row>
        <Row label="Unit Decimals">
          <Text color="alternative">
            {config.unit?.decimals.toString() ?? 'N/A'}
          </Text>
        </Row>
        <Row label="Unit Symbol">
          <Text color="alternative">{config.unit?.symbol ?? 'N/A'}</Text>
        </Row>
      </Section>
    </Box>
  )
}
