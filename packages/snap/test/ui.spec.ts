import { createFixture } from 'metamask-testing-tools'

const fixture = createFixture({
  isolated: true,
  downloadOptions: {
    flask: true,
  },
  snap: {
    id: 'local:http://localhost:8080',
  },
  cacheUserDir: true,
  devtools: false,
})

fixture.test.describe.skip('JSX UI', () => {
  fixture.test.beforeEach(async ({ metamask }) => {
    await metamask.page.getByTestId('confirmation-submit-button').click()
  })

  fixture.test('should get configure for testnet', async ({ metamask }) => {
    await metamask.goToHomepage('local:http://localhost:8080')
    // await metamask.goBack()
    await metamask.page.waitForTimeout(6666666)
  })
})
