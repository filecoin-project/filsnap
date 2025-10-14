import {
  Box,
  Link,
  Section,
  type SnapComponent,
  Text,
} from '@metamask/snaps-sdk/jsx'
import iconPartyPopper from '../svg/party-popper.svg'
import { Header } from './header.tsx'

/**
 *  This component is displayed after the snap has been installed. It provides a welcome message and instructions for using the snap.
 */
export const OnInstall: SnapComponent = () => {
  return (
    <Box>
      <Header
        alignment="center"
        icon={iconPartyPopper}
        iconColor="success"
        iconSize={24}
      >
        Installation Successful
      </Header>
      <Section>
        <Text>
          Your MetaMask wallet now has support for Filecoin, and you can start
          using it!
        </Text>
        <Text>
          Visit the <Link href="https://filsnap.dev">companion dapp</Link> to
          get started.
        </Text>
      </Section>
    </Box>
  )
}
