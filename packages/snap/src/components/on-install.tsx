import {
  Box,
  Copyable,
  Link,
  Section,
  type SnapComponent,
  Text,
} from '@metamask/snaps-sdk/jsx'
import { SNAP_ID } from '../constants'
import iconPartyPopper from '../svg/party-popper.svg'
import { Header } from './header'

/**
 *  This component is displayed after the snap has been installed. It provides a welcome message and instructions for using the snap.
 */
export const OnInstall: SnapComponent = () => {
  const homepageURI = `metamask://snap/${SNAP_ID}/home`
  return (
    <Box>
      <Header
        icon={iconPartyPopper}
        iconColor="success"
        iconSize={24}
        alignment="center"
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
        <Copyable value={homepageURI} />

        <Link href={homepageURI}>Go to Snap Homepage</Link>
      </Section>
    </Box>
  )
}
