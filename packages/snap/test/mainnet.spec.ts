import { createFixture } from 'metamask-testing-tools'
import type { GetAddressResponse, GetPublicResponse } from '../src/types'

const { test, expect } = createFixture({
  isolated: false,
  downloadOptions: {
    flask: true,
  },
  snap: {
    id: 'local:http://localhost:8080',
    version: '*',
  },
})
test.beforeAll(async ({ metamask, page }) => {
  await metamask.page.getByTestId('confirmation-submit-button').click()
  const req = metamask.invokeSnap({
    request: {
      method: 'fil_configure',
      params: {
        network: 'mainnet',
      },
    },
    page,
  })

  await metamask.waitForConfirmation()

  await req
})
test.describe('filsnap mainnet api', () => {
  test('should get address mainnet', async ({ page, metamask }) => {
    const { result } = await metamask.invokeSnap<GetAddressResponse>({
      request: {
        method: 'fil_getAddress',
      },
      page,
    })

    expect(result).toBe('f1jbnosztqwadgh4smvsnojdvwjgqxsmtzy5n5imi')
  })

  test('should get public key', async ({ metamask, page }) => {
    const { result } = await metamask.invokeSnap<GetPublicResponse>({
      request: {
        method: 'fil_getPublicKey',
      },
      page,
    })

    expect(result).toBe(
      '04ce1e0e407bed99153d98e909e53bb2186fd322b998c3c5feda46ede66d02d1468e30c2fd54309158991dc0b8d7bbbed8d6816bc54aab2a39496cfc7826a4e537'
    )
  })
})
