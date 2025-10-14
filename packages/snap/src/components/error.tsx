import { Box, Section, type SnapComponent, Text } from '@metamask/snaps-sdk/jsx'
import * as Icons from '../svg/index.tsx'
import type { InterfaceContext } from '../types.ts'
import { ButtonSvgIcon } from './button-svg-icon.tsx'
import { Footer } from './footer.tsx'
import { Header } from './header.tsx'

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
      <Header icon={Icons.error} iconColor="error" iconSize={24}>
        {name ?? 'Unknown Error'}
      </Header>
      {message ? (
        <Section alignment="center" direction="vertical">
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
