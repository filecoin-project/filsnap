import { createFixture } from 'metamask-testing-tools'

const SNAP_ID = process.env.METAMASK_SNAP_ID || 'npm:/filsnap'
let fixture = createFixture({
  download: {
    flask: true,
  },
  snap: {
    snapId: SNAP_ID,
  },
})

fixture.test.describe('filsnap adapter', () => {
  fixture.test(
    'should enable snap when already installed',
    async ({ metamask, page }) => {
      await page.getByTestId('enable-snap').click()

      await fixture
        .expect(page.getByTestId('output'))
        .toHaveText(
          '{"snapOrigin":"npm:@chainsafe/filsnap","snapId":"npm:@chainsafe/filsnap"}'
        )
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
