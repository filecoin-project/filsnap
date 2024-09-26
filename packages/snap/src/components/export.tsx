import {
  Bold,
  Box,
  Copyable,
  Heading,
  type SnapComponent,
  Text,
} from '@metamask/snaps-sdk/jsx'

type ExportConfirmProps = {
  address: string
  accountNumber: number
}

export const ExportConfirm: SnapComponent<ExportConfirmProps> = ({
  address,
  accountNumber,
}) => {
  return (
    <Box>
      <Heading>Private Key Export Request</Heading>
      <Text>
        Do you want to export <Bold>Account {accountNumber.toString()}</Bold>{' '}
        private key ?
      </Text>
      <Text>Address:</Text>
      <Copyable value={address} />
    </Box>
  )
}

type PrivateKeyExportProps = {
  privateKey: string
}

export const PrivateKeyExport: SnapComponent<PrivateKeyExportProps> = ({
  privateKey,
}) => {
  return (
    <Box>
      <Heading>Private Key</Heading>
      <Copyable value={privateKey} />
    </Box>
  )
}
