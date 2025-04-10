import { createFixture } from 'metamask-testing-tools'

const SNAP_ID = 'local:http://localhost:8080'
const SNAP_VERSION = '*'
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
  isolated: true,

  downloadOptions: {
    flask: true,
  },
})

fixture.test(
  'should start connect to snap when flask is installed',
  async ({ metamask, page }) => {
    await page.reload()
    await page.getByTestId('connect-snap').click()

    const dialog = await metamask.waitForDialog('**/experimental-area')
    await fixture.expect(dialog.getByTestId('experimental-area')).toBeVisible()
  }
)

fixture.test(
  'should start enabling snap when metamask as an account',
  async ({ metamask, page }) => {
    await metamask.setup()
    await page.reload()
    await page.getByTestId('connect-snap').click()

    const dialog = await metamask.waitForDialog('**/snaps-connect')
    fixture.expect(dialog).toBeDefined()
  }
)

fixture = createFixture({
  isolated: true,
  downloadOptions: {
    flask: true,
  },
  snap: {
    id: SNAP_ID,
    version: SNAP_VERSION,
  },
})

fixture.test(
  'should show connect button when snap is installed',
  async ({ metamask, page }) => {
    await page.reload()
    await page.getByTestId('connect-snap').click()

    const dialog = await metamask.waitForDialog((url) => {
      return url.hash.includes('confirmation')
    })
    fixture.expect(dialog).toBeDefined()
  }
)

fixture = createFixture({
  isolated: true,
  downloadOptions: {
    flask: true,
    extensionsIds: [RAINBOW_EXTENSION_ID],
  },
})

fixture.test(
  'should start connect to snap when flask is installed alongside rainbow wallet',
  async ({ metamask, page }) => {
    await metamask.setup({ setupExtraExtensions })
    await metamask.installSnap({
      id: SNAP_ID,
      version: SNAP_VERSION,
      page,
    })
    await page.goto('/')
    await page.reload()
    await page.getByTestId('connect-snap').click()

    const dialog = await metamask.waitForDialog((url) => {
      return url.hash.includes('confirmation')
    })
    fixture.expect(dialog).toBeDefined()
  }
)
