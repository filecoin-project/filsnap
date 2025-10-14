import {
  Box,
  Dropdown,
  Field,
  Form,
  Input,
  Option,
  Section,
} from '@metamask/snaps-sdk/jsx'
import { z } from 'zod/v4'
import { INTERNAL_CONFIG } from '../constants.ts'
import { State } from '../state.ts'
import * as Icons from '../svg/index.tsx'
import type { HomepageContext } from '../types.ts'
import { pathFromNetworkAndMode } from '../utils.ts'
import { ButtonSvgIcon } from './button-svg-icon.tsx'
import { Footer } from './footer.tsx'
import { Header } from './header.tsx'
import { HomepageEvents, updateHomepage } from './homepage.tsx'
import { updateWithProgress } from './progress.tsx'

export async function onSettings(id: string, context: HomepageContext) {
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: (
        <Box>
          <Header alignment="center" icon={Icons.settings} iconSize={24}>
            Settings
          </Header>
          <Form name="settingsForm">
            <Section>
              <Field label="Derivation Mode">
                <Dropdown
                  name="derivationMode"
                  value={context.config.derivationMode}
                >
                  <Option value="ledger">Ledger</Option>
                  <Option value="native">Native</Option>
                </Dropdown>
              </Field>
              <Field label="Account">
                <Input
                  name="account"
                  placeholder="Enter your account"
                  type="number"
                  value={context.account.toString()}
                />
              </Field>
            </Section>
            <Footer>
              <ButtonSvgIcon
                icon={Icons.chevronLeft}
                name={HomepageEvents.back}
              >
                Back
              </ButtonSvgIcon>
              <ButtonSvgIcon
                icon={Icons.chevronRight}
                name={HomepageEvents.saveSettings}
                type="submit"
              >
                Save
              </ButtonSvgIcon>
            </Footer>
          </Form>
        </Box>
      ),
    },
  })
}

const settingsSchema = z.object({
  derivationMode: z.enum(['native', 'ledger']),
  account: z.coerce.number(),
})

/**
 * Send confirmation handler
 */
export async function onSaveSettings(id: string, context: HomepageContext) {
  // Get form state
  const state1 = await snap.request({
    method: 'snap_getInterfaceState',
    params: {
      id,
    },
  })

  await updateWithProgress(id, context)
  const state = new State(snap)

  const config = await state.get(INTERNAL_CONFIG)
  if (!config) {
    throw new Error('Config not found')
  }

  const formData = settingsSchema.safeParse(state1.settingsForm)
  if (!formData.success) {
    throw new Error('Invalid form data')
  }

  const path = pathFromNetworkAndMode(
    config.network,
    formData.data.account,
    formData.data.derivationMode
  )

  await state.set(INTERNAL_CONFIG, {
    derivationMode: formData.data.derivationMode,
    derivationPath: path,
    rpc: config.rpc,
    network: config.network,
    unit: config.unit,
  })

  await updateHomepage(id, context)
}
