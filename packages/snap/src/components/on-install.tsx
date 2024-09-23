import {
  Box,
  Heading,
  Link,
  type SnapComponent,
  Text,
} from '@metamask/snaps-sdk/jsx'

export const OnInstall: SnapComponent = () => {
  return (
    <Box>
      <Heading>Installation successful 🎉</Heading>
      <Text>
        Your MetaMask wallet now has support for Filecoin, and you can start
        using it!
      </Text>
      <Text>
        Visit the <Link href="https://filsnap.dev">companion dapp</Link>
        to get started.
      </Text>
    </Box>
  )
}
