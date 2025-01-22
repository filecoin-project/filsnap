import { Box, type SnapComponent, Text } from '@metamask/snaps-sdk/jsx'

type HomePageProps = {
  unit: number
}

export const Spacer: SnapComponent<HomePageProps> = ({ unit = 1 }) => {
  return (
    <Box>
      {Array.from({ length: unit }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <Text key={`spacer${i}`}> </Text>
      ))}
    </Box>
  )
}
