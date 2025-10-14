import {
  Box,
  Section,
  type SnapComponent,
  Spinner,
  Text,
} from '@metamask/snaps-sdk/jsx'
import type { HomepageContext } from '../types.ts'

type Processprops = {
  waitMessage?: string
}

export const Progress: SnapComponent<Processprops> = ({
  waitMessage = 'Please wait ...',
}) => {
  return (
    <Box>
      <Section>
        <Box alignment="center" center direction="vertical">
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
