import {
  Box,
  Link,
  Section,
  type SnapComponent,
  Text,
} from '@metamask/snaps-sdk/jsx'
import json from '../../snap.manifest.json'
import iconPartyPopper from '../svg/party-popper.svg'
import { Header } from './header'

export const OnUpdate: SnapComponent = () => {
  return (
    <Box>
      <Header
        icon={iconPartyPopper}
        iconColor="success"
        iconSize={24}
        alignment="center"
      >
        Update Successful
      </Header>
      <Section>
        <Text>
          Check the{' '}
          <Link
            href={`https://github.com/filecoin-project/filsnap/releases/tag/filsnap-v${json.version}`}
          >
            changelog
          </Link>{' '}
          for more details.
        </Text>
        <Text>
          Visit the <Link href="https://filsnap.dev">companion dapp</Link> to
          get started.
        </Text>
      </Section>
    </Box>
  )
}
