import {
  Box,
  Heading,
  Row,
  type SnapComponent,
  Text,
} from '@metamask/snaps-sdk/jsx'

type ErrorBoxProps = {
  error: string
}
export const ErrorBox: SnapComponent<ErrorBoxProps> = ({ error }) => {
  return (
    <Box>
      <Heading>Error</Heading>
      <Row label="Message:" variant="critical">
        <Text>{error}</Text>
      </Row>
    </Box>
  )
}
