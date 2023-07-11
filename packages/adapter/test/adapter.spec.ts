import { createFixture } from 'metamask-testing-tools'

const SNAP_ID = 'local:http://localhost:8081'
let fixture = createFixture({
  download: {
    flask: true,
  },
  snap: {
    snapId: SNAP_ID,
    version: '*',
  },
})

fixture.test.describe('filsnap adapter', () => {
  fixture.test(
    'should enable snap when already installed',
    async ({ metamask, page }) => {
      await page.getByTestId('enable-snap').click()
      await page.pause()
      await fixture
        .expect(page.getByTestId('output'))
        .toHaveText(`{"snapId":"${SNAP_ID}"}`)
    }
  )

  fixture = createFixture({})
  fixture.test(
    'should enable error when flask is not installed',
    async ({ metamask, page }) => {
      await page.getByTestId('enable-snap').click()

      await fixture
        .expect(page.getByTestId('error'))
        .toHaveText("Current Metamask version doesn't support snaps")
    }
  )
})
