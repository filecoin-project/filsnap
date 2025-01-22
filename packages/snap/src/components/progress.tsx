import {
  Box,
  Section,
  type SnapComponent,
  Spinner,
  Text,
} from '@metamask/snaps-sdk/jsx'
import type { HomepageContext } from '../types'

type Processprops = {
  waitMessage?: string
}

export const Progress: SnapComponent<Processprops> = ({
  waitMessage = 'Please wait ...',
}) => {
  return (
    <Box>
      <Section>
        <Box center direction="vertical" alignment="center">
          <Text>{waitMessage}</Text>
          <Spinner />
        </Box>
      </Section>
    </Box>
  )
}

export function updateWithProgress(
  id: string,
  context: HomepageContext,
  msg?: string
) {
  return snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: <Progress waitMessage={msg} />,
      context,
    },
  })
}
