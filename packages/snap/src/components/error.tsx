import {
  Box,
  Button,
  Image,
  Section,
  type SnapComponent,
  Text,
} from '@metamask/snaps-sdk/jsx'
import iconError from '../svg/error.svg'
import type { HomepageContext } from '../types'
import { Spacer } from './spacer'

export type ErrorBoxProps = {
  name: string
  message?: string
  back?: string
}
export const ErrorBox: SnapComponent<ErrorBoxProps> = ({
  name,
  message,
  back,
}) => {
  return (
    <Box>
      <Section direction="vertical" alignment="center">
        <Box direction="horizontal">
          <Image src={iconError} />
          <Text color="error">{name ?? 'Unknown Error'}</Text>
        </Box>
        {message ? <Text color="muted">{message}</Text> : null}
        {back ? (
          <Box direction="horizontal" alignment="center">
            <Spacer unit={3} />
            <Button type="button" name={back}>
              Back
            </Button>
          </Box>
        ) : null}
      </Section>
    </Box>
  )
}

export function updateWithError(
  id: string,
  context: HomepageContext,
  props: ErrorBoxProps
) {
  return snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: <ErrorBox {...props} />,
      context,
    },
  })
}
