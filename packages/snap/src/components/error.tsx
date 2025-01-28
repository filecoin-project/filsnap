import { Box, Section, type SnapComponent, Text } from '@metamask/snaps-sdk/jsx'
import * as Icons from '../svg'
import type { InterfaceContext } from '../types'
import { ButtonSvgIcon } from './button-svg-icon'
import { Footer } from './footer'
import { Header } from './header'

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
      <Header icon={Icons.error} iconSize={24} iconColor="error">
        {name ?? 'Unknown Error'}
      </Header>
      {message ? (
        <Section direction="vertical" alignment="center">
          <Text color="alternative">{message}</Text>
        </Section>
      ) : null}

      {back ? (
        <Footer>
          <ButtonSvgIcon icon={Icons.x} name={back}>
            Close
          </ButtonSvgIcon>
        </Footer>
      ) : null}
    </Box>
  )
}

export function updateWithError(
  id: string,
  context: InterfaceContext,
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
