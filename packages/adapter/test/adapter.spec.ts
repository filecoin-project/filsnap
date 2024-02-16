// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createFixture } from 'metamask-testing-tools'

const SNAP_ID = 'local:http://localhost:8081'
const SNAP_VERSION = '*'
const password = '12345678'
const rainbowExtensionId = 'opfgelmcmbiajamepnmloijbpoleiama'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, jsdoc/require-jsdoc
async function setupExtraExtensions(
  data: Record<string, unknown> | ArrayLike<unknown>
) {
  for (const [key, value] of Object.entries(data)) {
    if (key === rainbowExtensionId) {
      const page = (value as any).page
      await page.getByTestId('create-wallet-button').click()
      await page.getByTestId('skip-button').click()
      await page.getByTestId('password-input').fill(password)
      await page.getByTestId('confirm-password-input').fill(password)
      await page.getByTestId('set-password-button').click()
    }
  }
}

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
  isolated: true,
  download: {
    flask: true,
    extensions: [
      {
        id: rainbowExtensionId,
        title: 'Rainbow Wallet',
        findPage: async (ctx, installedExtensionId) => {
          let page = ctx
            .pages()
            .find((p) =>
              p
                .url()
                .startsWith(
                  `chrome-extension://${installedExtensionId}/popup.html`
                )
            )

          if (page === null) {
            page = await ctx.waitForEvent('page', {
              predicate: (page) => {
                return page
                  .url()
                  .startsWith(
                    `chrome-extension://${installedExtensionId}/popup.html`
                  )
              },
            })
          }
          await page.waitForLoadState('domcontentloaded')
          return page
        },
      },
    ],
  },
  snap: {
    id: SNAP_ID,
    version: SNAP_VERSION,
  },
})

fixture.test(
  'should start connect to snap when flask is installed alongside rainbow wallet',
  async ({ metamask, page, extraExtensions }) => {
    await extraExtensions(setupExtraExtensions)
    await page.getByTestId('connect-snap').click()

    const dialog = await metamask.waitForDialog('experimental-area')
    await fixture.expect(dialog.getByTestId('experimental-area')).toBeVisible()
  }
)

fixture = createFixture({
  download: {
    tag: 'v10.35.1',
  },
})
fixture.test(
  'should enable error when flask is not installed',
  async ({ metamask, page, extraExtensions }) => {
    await extraExtensions(setupExtraExtensions)

    await fixture
      .expect(page.getByTestId('install-mm-flask'))
      .toHaveText('Install Metamask Flask')
  }
)
