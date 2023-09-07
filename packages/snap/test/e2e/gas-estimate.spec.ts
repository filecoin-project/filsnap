import { createFixture } from 'metamask-testing-tools'
import type {
  GasForMessageRequest,
  GasForMessageResponse,
} from '../../src/rpc/gas-for-message'

const TARGET_ADDRESS = 't1sfizuhpgjqyl4yjydlebncvecf3q2cmeeathzwi'
const { test, expect } = createFixture({
  isolated: false,
  download: {
    flask: true,
  },
  snap: {
    id: 'local:http://localhost:8081',
  },
})
test.beforeAll(async ({ metamask, page }) => {
  await metamask.invokeSnap({
    request: {
      method: 'fil_configure',
      params: {
        network: 'testnet',
      },
    },
    page,
  })
})
test.describe('fil_getGasForMessage', () => {
  test('should estimate on testnet', async ({ metamask, page }) => {
    const message = {
      to: TARGET_ADDRESS,
      value: '0',
    }

    const estimate = await metamask.invokeSnap<GasForMessageResponse>({
      request: {
        method: 'fil_getGasForMessage',
        params: { message },
      },
      page,
    })

    if (estimate.error != null) {
      throw new Error(estimate.error.message)
    }

    expect(estimate.result.gasLimit).toBeGreaterThanOrEqual(1000)
  })

  test('should estimate on testnet with 0.2 FIL maxfee', async ({
    metamask,
    page,
  }) => {
    const message = {
      to: TARGET_ADDRESS,
      value: '0',
    }

    const estimate = await metamask.invokeSnap<GasForMessageResponse>({
      request: {
        method: 'fil_getGasForMessage',
        params: { message, maxFee: '200000000000000000' },
      },
      page,
    })

    if (estimate.error != null) {
      throw new Error(estimate.error.message)
    }

    expect(estimate.result.gasLimit).toBeGreaterThanOrEqual(1000)
  })

  test('should estimate on testnet for non 0 value', async ({
    metamask,
    page,
  }) => {
    const message = {
      to: TARGET_ADDRESS,
      value: '100000000000000000',
    }

    const estimate = await metamask.invokeSnap<GasForMessageResponse>({
      request: {
        method: 'fil_getGasForMessage',
        params: { message },
      },
      page,
    })

    if (estimate.error != null) {
      throw new Error('Should not error')
    }

    expect(estimate.result.gasLimit).toBeGreaterThanOrEqual(1000)
  })

  test('should error with invalid params', async ({ metamask, page }) => {
    const message = {
      to: TARGET_ADDRESS,
      value: 100,
    }

    const estimate = await metamask.invokeSnap<GasForMessageResponse>({
      request: {
        method: 'fil_getGasForMessage',
        // @ts-expect-error - invalid params
        params: { message },
      } satisfies GasForMessageRequest,
      page,
    })

    if (estimate.result != null) {
      throw new Error('Should fail')
    }
    expect(estimate.error.message).toContain('Invalid params')
  })
})
