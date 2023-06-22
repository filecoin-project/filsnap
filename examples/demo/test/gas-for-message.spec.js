import { createFixture } from 'metamask-testing-tools'

const TARGET_ADDRESS = 't1sfizuhpgjqyl4yjydlebncvecf3q2cmeeathzwi'
const SNAP_ID = process.env.METAMASK_SNAP_ID || 'npm:filsnap'
const { test, expect } = createFixture({
  isolated: false,
  download: {
    flask: true,
  },
  snap: {
    snapId: SNAP_ID,
  },
})

test.describe('fil_getGasForMessage', () => {
  test('should estimate on testnet', async ({ metamask, page }) => {
    await metamask.invokeSnap({
      request: {
        method: 'fil_configure',
        params: {
          configuration: { network: 't' },
        },
      },
      page,
    })

    /** @type {import('@chainsafe/filsnap-types').MessageRequest} */
    const message = {
      to: TARGET_ADDRESS,
      value: '0',
    }

    /** @type {import('@chainsafe/filsnap-types').MessageGasEstimate} */
    const result = await metamask.invokeSnap({
      request: {
        method: 'fil_getGasForMessage',
        params: { message },
      },
      page,
    })

    expect(result.gaslimit).toBeGreaterThanOrEqual(1000)
    expect(result.maxfee).toBe('100000000000000000')
  })

  test('should estimate on testnet with 0.2 FIL maxfee', async ({
    metamask,
    page,
  }) => {
    await metamask.invokeSnap({
      request: {
        method: 'fil_configure',
        params: {
          configuration: { network: 't' },
        },
      },
      page,
    })

    /** @type {import('@chainsafe/filsnap-types').MessageRequest} */
    const message = {
      to: TARGET_ADDRESS,
      value: '0',
    }

    /** @type {import('@chainsafe/filsnap-types').MessageGasEstimate} */
    const result = await metamask.invokeSnap({
      request: {
        method: 'fil_getGasForMessage',
        params: { message, maxFee: '200000000000000000' },
      },
      page,
    })

    expect(result.gaslimit).toBeGreaterThanOrEqual(1000)
    expect(result.maxfee).toBe('200000000000000000')
  })

  test('should estimate on testnet for non 0 value', async ({
    metamask,
    page,
  }) => {
    await metamask.invokeSnap({
      request: {
        method: 'fil_configure',
        params: {
          configuration: { network: 't' },
        },
      },
      page,
    })

    /** @type {import('@chainsafe/filsnap-types').MessageRequest} */
    const message = {
      to: TARGET_ADDRESS,
      value: '100000000000000000',
    }

    /** @type {import('@chainsafe/filsnap-types').MessageGasEstimate} */
    const result = await metamask.invokeSnap({
      request: {
        method: 'fil_getGasForMessage',
        params: { message },
      },
      page,
    })

    expect(result.gaslimit).toBeGreaterThanOrEqual(1000)
  })
})
