import { Box, Image, type SnapComponent, Text } from '@metamask/snaps-sdk/jsx'
import iconError from '../svg/error.svg'
type ErrorBoxProps = {
  name: string
  message?: string
}
export const ErrorBox: SnapComponent<ErrorBoxProps> = ({ name, message }) => {
  if (message != null) {
    return (
      <Box>
        <Box direction="horizontal">
          <Image src={iconError} />
          <Text color="error">{name}</Text>
        </Box>
        <Text color="muted">{message}</Text>
      </Box>
    )
  }

  return (
    <Box>
      <Box direction="horizontal">
        <Image src={iconError} />
        <Text color="error">{name}</Text>
      </Box>
    </Box>
  )
}
