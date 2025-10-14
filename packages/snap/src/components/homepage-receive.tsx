import {
  Box,
  Copyable,
  Heading,
  Image,
  Section,
  Text,
} from '@metamask/snaps-sdk/jsx'
import encodeQR from 'qr'
import * as Icons from '../svg/index.tsx'
import type { HomepageContext } from '../types.ts'
import { ButtonSvgIcon } from './button-svg-icon.tsx'
import { Footer } from './footer.tsx'
import { Header } from './header.tsx'
import { HomepageEvents } from './homepage.tsx'
import { Spacer } from './spacer.tsx'

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
          <Header alignment="center" icon={Icons.qrCode} iconSize={24}>
            Receive ⨎
          </Header>
          <Section>
            <Box alignment="center" direction="horizontal">
              <Image src={qr} />
            </Box>
            <Spacer unit={2} />
            <Box alignment="center" direction="horizontal">
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
