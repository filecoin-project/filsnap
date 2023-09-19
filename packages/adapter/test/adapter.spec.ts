import { createFixture } from 'metamask-testing-tools'

const SNAP_ID = 'local:http://localhost:8081'
const SNAP_VERSION = '*'

let fixture = createFixture({
  download: {
    flask: true,
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
  download: {
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
    await page.getByTestId('connect-snap').click()

    const dialog = await metamask.waitForDialog('snap-install')
    fixture.expect(dialog).toBeDefined()
  }
)

fixture = createFixture({
  download: {
    tag: 'v10.35.1',
  },
})
fixture.test(
  'should enable error when flask is not installed',
  async ({ metamask, page }) => {
    await fixture
      .expect(page.getByTestId('install-mm-flask'))
      .toHaveText('Install Metamask Flask')
  }
)
