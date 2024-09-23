import {
  Box,
  Heading,
  Link,
  type SnapComponent,
  Text,
} from '@metamask/snaps-sdk/jsx'
import json from '../../snap.manifest.json'

export const OnUpdate: SnapComponent = () => {
  return (
    <Box>
      <Heading>Update successful 🎉</Heading>
      <Text>
        Check the{' '}
        <Link
          href={`https://github.com/filecoin-project/filsnap/releases/tag/filsnap-v${json.version}`}
        >
          changelog
        </Link>
        for more details.
      </Text>
      <Text>
        Visit the <Link href="https://filsnap.dev">companion dapp</Link>
        to get started.
      </Text>
    </Box>
  )
}
