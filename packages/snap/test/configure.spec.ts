import { createFixture } from 'metamask-testing-tools'
import type { ConfigureRequest, ConfigureResponse } from '../src/rpc/configure'

const { test, expect } = createFixture({
  isolated: true,
  downloadOptions: {
    flask: true,
  },
  snap: {
    id: 'local:http://localhost:8080',
  },
})

test.describe('fil_configure', () => {
  test('should get configure for testnet', async ({ metamask, page }) => {
    await metamask.page.getByTestId('confirmation-submit-button').click()
    const req = metamask.invokeSnap<ConfigureResponse>({
      request: {
        method: 'fil_configure',
        params: {
          network: 'testnet',
        },
      } satisfies ConfigureRequest,
      page,
    })

    await metamask.waitForConfirmation()

    const response = await req
    expect(response.result).toStrictEqual({
      derivationPath: "m/44'/1'/0'/0/0",
      network: 'testnet',
      rpc: { token: '', url: 'https://api.calibration.node.glif.io' },
      unit: {
        decimals: 18,
        symbol: 'tFIL',
      },
    })
  })

  test('should get configure for main', async ({ metamask, page }) => {
    await metamask.page.getByTestId('confirmation-submit-button').click()
    const req = metamask.invokeSnap<ConfigureResponse>({
      request: {
        method: 'fil_configure',
        params: {
          network: 'mainnet',
        },
      } satisfies ConfigureRequest,
      page,
    })

    await metamask.waitForConfirmation()

    const response = await req
    expect(response.result).toStrictEqual({
      derivationPath: "m/44'/461'/0'/0/0",
      network: 'mainnet',
      rpc: { token: '', url: 'https://api.node.glif.io' },
      unit: {
        decimals: 18,
        symbol: 'FIL',
      },
    })
  })
})
