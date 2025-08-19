import {
  Box,
  Copyable,
  Heading,
  Image,
  Section,
  Text,
} from '@metamask/snaps-sdk/jsx'
import encodeQR from 'qr'
import * as Icons from '../svg'
import type { HomepageContext } from '../types'
import { ButtonSvgIcon } from './button-svg-icon'
import { Footer } from './footer'
import { Header } from './header'
import { HomepageEvents } from './homepage'
import { Spacer } from './spacer'

export async function onReceive(id: string, context: HomepageContext) {
  const qr = encodeQR(context.address, 'svg').replace(
    'xmlns="http://www.w3.org/2000/svg"',
    'xmlns="http://www.w3.org/2000/svg" width="200" height="200" style="background-color:white;"'
  )

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: (
        <Box>
          <Header icon={Icons.qrCode} iconSize={24} alignment="center">
            Receive ⨎
          </Header>
          <Section>
            <Box direction="horizontal" alignment="center">
              <Image src={qr} />
            </Box>
            <Spacer unit={2} />
            <Box direction="horizontal" alignment="center">
              <Heading>Account {context.account.toString()}</Heading>
              <Text color="alternative">{context.config.derivationPath}</Text>
              {/* <Text color="alternative">{context.config.network}</Text>
              <Text color="alternative">
                {context.config.derivationMode ?? 'sss'}
              </Text> */}
            </Box>
            <Text color="alternative">Address:</Text>
            <Copyable value={context.address} />
            <Copyable value={context.addressEth ?? ''} />
          </Section>
          <Footer>
            <ButtonSvgIcon icon={Icons.chevronLeft} name={HomepageEvents.back}>
              Back
            </ButtonSvgIcon>
          </Footer>
        </Box>
      ),
    },
  })
}
