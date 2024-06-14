import { createFixture } from 'metamask-testing-tools'

const SNAP_ID = 'local:http://localhost:8081'
const SNAP_VERSION = '*'
const METAMASK_VERSION = 'v11.16.5'
const RAINBOW_PASSWORD = '12345678'
const RAINBOW_EXTENSION_ID = 'opfgelmcmbiajamepnmloijbpoleiama'

/**
 * @param {any} data
 */
async function setupExtraExtensions(data) {
  for (const extension of data) {
    if (extension.title === 'Rainbow Wallet') {
      const page = extension.page
      await page.getByTestId('create-wallet-button').click()
      await page.getByTestId('skip-button').click()
      await page.getByTestId('password-input').fill(RAINBOW_PASSWORD)
      await page.getByTestId('confirm-password-input').fill(RAINBOW_PASSWORD)
      await page.getByTestId('set-password-button').click()
    }
  }
}

let fixture = createFixture({
  downloadOptions: {
    flask: true,
    tag: METAMASK_VERSION,
  },
})

fixture.test(
  'should start connect to snap when flask is installed',
  async ({ metamask, page }) => {
    await page.getByTestId('connect-snap').click()

    const dialog = await metamask.waitForDialog('experimental-area')
    await fixture.expect(dialog.getByTestId('experimental-area')).toBeVisible()
  }
)

fixture.test(
  'should start enabling snap when metamask as an account',
  async ({ metamask, page }) => {
    await metamask.setup()
    await page.getByTestId('connect-snap').click()

    const dialog = await metamask.waitForDialog('snaps-connect')
    fixture.expect(dialog).toBeDefined()
  }
)

fixture = createFixture({
  isolated: true,
  downloadOptions: {
    flask: true,
    tag: METAMASK_VERSION,
  },
  snap: {
    id: SNAP_ID,
    version: SNAP_VERSION,
  },
})

fixture.test(
  'should show connect button when snap is installed',
  async ({ metamask, page }) => {
    await page.getByTestId('connect-snap').click()

    const dialog = await metamask.waitForDialog('confirmation')
    fixture.expect(dialog).toBeDefined()
  }
)

fixture = createFixture({
  isolated: true,
  downloadOptions: {
    flask: true,
    extensionsIds: [RAINBOW_EXTENSION_ID],
    tag: METAMASK_VERSION,
  },
  snap: {
    id: SNAP_ID,
    version: SNAP_VERSION,
  },
})

fixture.test(
  'should start connect to snap when flask is installed alongside rainbow wallet',
  async ({ metamask, page }) => {
    await metamask.setupExtraExtensions(setupExtraExtensions)
    await page.getByTestId('connect-snap').click()

    const dialog = await metamask.waitForDialog('confirmation')
    fixture.expect(dialog).toBeDefined()
  }
)
