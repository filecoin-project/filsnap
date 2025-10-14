import { createFixture } from 'metamask-testing-tools'
import type { filGetConfig } from '../src/rpc/configure.ts'
import type { ExportPrivateKeyResponse } from '../src/rpc/export-private-key.ts'
import type {
  SignMessageRawRequest,
  SignMessageRequest,
  SignMessageResponse,
} from '../src/rpc/sign-message.ts'

const fixture = createFixture({
  isolated: false,
  downloadOptions: {
    flask: true,
  },
  snap: {
    id: 'local:http://localhost:8080',
  },
  cacheUserDir: false,
  devtools: true,
})

fixture.test.describe('JSX UI Dialogs', () => {
  fixture.test.beforeAll(async ({ metamask, page }) => {
    // Install popup
    await metamask.page.getByTestId('confirmation-submit-button').click()

    const config = await metamask.invokeSnap<ReturnType<typeof filGetConfig>>({
      request: {
        method: 'fil_getConfig',
      },
      page,
    })
    if (!config.result) {
      const req = metamask.invokeSnap({
        request: {
          method: 'fil_configure',
          params: {
            network: 'testnet',
          },
        },
        page,
      })
      await metamask.waitForConfirmation()
      await req
    }
  })

  fixture.test('API fil_configure dialog UI', async ({ metamask, page }) => {
    const config = await metamask.invokeSnap<ReturnType<typeof filGetConfig>>({
      request: {
        method: 'fil_getConfig',
      },
      page,
    })

    const decimals = config.result?.unit?.decimals
      ? config.result.unit.decimals - 1
      : 17
    const req = metamask.invokeSnap({
      request: {
        method: 'fil_configure',
        params: {
          network: 'testnet',
          unit: {
            decimals,
          },
        },
      },
      page,
    })

    await metamask.waitForDialog((url) => {
      return url.hash.includes('confirmation')
    })

    // await metamask.page.waitForTimeout(60000000)
    await fixture
      .expect(metamask.page.getByText('Connection Request'))
      .toBeVisible()
    await fixture
      .expect(metamask.page.getByText('from http://localhost:8081'))
      .toBeVisible()

    await fixture
      .expect(metamask.page.getByText('t1pc2ap...eelna'))
      .toBeVisible()
    await fixture
      .expect(metamask.page.getByText(decimals.toString()))
      .toBeVisible()

    await metamask.page.getByTestId('confirmation-submit-button').click()
    await req
  })

  fixture.test('API fil_signMessage dialog UI', async ({ metamask, page }) => {
    const to = 't1sfizuhpgjqyl4yjydlebncvecf3q2cmeeathzwi'

    const message = {
      to,
      value: '1',
    }
    const sign = metamask.invokeSnap<SignMessageResponse>({
      request: {
        method: 'fil_signMessage',
        params: message,
      } satisfies SignMessageRequest,
      page,
    })
    await metamask.waitForDialog((url) => {
      return url.hash.includes('confirmation')
    })

    // await metamask.page.waitForTimeout(60000000)
    await fixture
      .expect(metamask.page.getByText('Transaction Request'))
      .toBeVisible()
    await fixture
      .expect(metamask.page.getByText('from http://localhost:8081'))
      .toBeVisible()
    await fixture
      .expect(
        metamask.page.getByText('This site is requesting a signature for:')
      )
      .toBeVisible()
    await fixture
      .expect(metamask.page.getByText('t1pc2ap...eelna'))
      .toBeVisible()
    await fixture
      .expect(metamask.page.getByText('t1sfizu...thzwi'))
      .toBeVisible()
    await metamask.page.getByTestId('confirmation-submit-button').click()
    await sign
  })

  fixture.test(
    'API fil_signMessageRaw dialog UI',
    async ({ metamask, page }) => {
      const req = metamask.invokeSnap({
        request: {
          method: 'fil_signMessageRaw',
          params: {
            message: '0x1234',
          },
        } satisfies SignMessageRawRequest,
        page,
      })

      await metamask.waitForDialog((url) => {
        return url.hash.includes('confirmation')
      })

      await fixture
        .expect(metamask.page.getByText('Signature Request'))
        .toBeVisible()
      await fixture
        .expect(metamask.page.getByText('from http://localhost:8081'))
        .toBeVisible()
      await fixture.expect(metamask.page.getByText('0x1234')).toBeVisible()

      await metamask.page.getByTestId('confirmation-submit-button').click()
      await req
      // await metamask.page.waitForTimeout(60000000)
    }
  )

  fixture.test(
    'API fil_exportPrivateKey dialog UI',
    async ({ metamask, page }) => {
      const req = metamask.invokeSnap<ExportPrivateKeyResponse>({
        request: {
          method: 'fil_exportPrivateKey',
        },
        page,
      })

      await metamask.waitForDialog((url) => {
        return url.hash.includes('confirmation')
      })
      await fixture
        .expect(metamask.page.getByText('Private Key Export Request'))
        .toBeVisible()
      await fixture
        .expect(metamask.page.getByText('from http://localhost:8081'))
        .toBeVisible()
      await fixture.expect(metamask.page.getByText('Account 0')).toBeVisible()

      await metamask.page.getByTestId('confirmation-submit-button').click()

      await metamask.waitForDialog((url) => {
        return url.hash.includes('confirmation')
      })
      await fixture
        .expect(metamask.page.getByText('Never disclose this key'))
        .toBeVisible()
      await fixture
        .expect(metamask.page.getByText('Raw base64 encoded private key'))
        .toBeVisible()
      await fixture
        .expect(metamask.page.getByText('Lotus hex encoded private key'))
        .toBeVisible()
      await metamask.page.getByTestId('confirmation-submit-button').click()
      // await metamask.page.waitForTimeout(60000000)
      await req
    }
  )
})

const preinstall = createFixture({
  isolated: true,
  downloadOptions: {
    flask: true,
  },
  cacheUserDir: false,
  devtools: true,
})

preinstall.test.describe('JSX UI Install', () => {
  preinstall.test('should show install dialog', async ({ metamask, page }) => {
    await metamask.setup()
    await metamask.installSnap({
      id: 'local:http://localhost:8080',
      page,
    })
    // await metamask.page.waitForTimeout(60000000)
    await fixture
      .expect(metamask.page.getByText('Installation Successful'))
      .toBeVisible()
  })
})

const homepage = createFixture({
  isolated: true,
  downloadOptions: {
    flask: true,
  },
  snap: {
    id: 'local:http://localhost:8080',
  },
  cacheUserDir: false,
  devtools: true,
})

homepage.test.describe('JSX UI Homepage', () => {
  homepage.test.beforeEach(async ({ metamask }) => {
    // Install popup
    await metamask.page.getByTestId('confirmation-submit-button').click()
  })

  homepage.test.skip(
    'should get configure for testnet',
    async ({ metamask }) => {
      await metamask.goToHomepage('local:http://localhost:8080')
      // await metamask.goBack()

      const networkSelect = metamask.page.getByTestId('snaps-dropdown')
      await networkSelect.selectOption('testnet')

      await metamask.page.getByText('Please wait ...').waitFor()
      await networkSelect.waitFor()

      await metamask.page.getByRole('button', { name: 'Receive' }).click()
      // await metamask.page
      //   .getByPlaceholder('f0, f1, f2, f3, f4 or 0x address')
      //   .fill('t1sfizuhpgjqyl4yjydlebncvecf3q2cmeeathzwi')

      // await metamask.page
      //   .getByPlaceholder('f0, f1, f2, f3, f4 or 0x address')
      //   .fill('0x7e4ABd63A7C8314Cc28D388303472353D884f292')
      // await metamask.page.getByPlaceholder('FIL').fill('0.00001')
      await metamask.page.waitForTimeout(60000000)
    }
  )
})
