import { createFixture } from 'metamask-testing-tools'

const SNAP_ID = process.env.METAMASK_SNAP_ID || 'npm:filsnap'
const { test, expect } = createFixture({
  download: {
    flask: true,
  },
  snap: {
    snapId: SNAP_ID,
  },
})

test.describe('filsnap api with default seed', () => {
  test('should get address mainnet', async ({ metamask, page }) => {
    const result = await metamask.invokeSnap({
      request: {
        method: 'fil_getAddress',
      },
      page,
    })

    expect(result).toBe('f1jbnosztqwadgh4smvsnojdvwjgqxsmtzy5n5imi')
  })

  test('should get address testnet', async ({ metamask, page }) => {
    await metamask.invokeSnap({
      request: {
        method: 'fil_configure',
        params: {
          configuration: { network: 't' },
        },
      },
      page,
    })
    const result = await metamask.invokeSnap({
      request: {
        method: 'fil_getAddress',
      },
      page,
    })

    expect(result).toBe('t1pc2apytmdas3sn5ylwhfa32jfpx7ez7ykieelna')
  })

  test('should get public key', async ({ metamask, page }) => {
    const result = await metamask.invokeSnap({
      request: {
        method: 'fil_getPublicKey',
      },
      page,
    })

    expect(result).toBe(
      '04ce1e0e407bed99153d98e909e53bb2186fd322b998c3c5feda46ede66d02d1468e30c2fd54309158991dc0b8d7bbbed8d6816bc54aab2a39496cfc7826a4e537'
    )
  })

  test('should get private key', async ({ metamask, page }) => {
    metamask.on('notification', (page) => {
      page.getByRole('button').filter({ hasText: 'Approve' }).click()
    })
    const result = await metamask.invokeSnap({
      request: {
        method: 'fil_exportPrivateKey',
      },
      page,
    })

    expect(result).toBe('IwTEHN6u6qxR76Lf8nkIm/JKLl9lRUAL0ulE80wOl/M=')
  })

  test('should get messages', async ({ metamask, page }) => {
    const result = await metamask.invokeSnap({
      request: {
        method: 'fil_getMessages',
      },
      page,
    })

    expect(result).toStrictEqual([])
  })

  test('should get balance', async ({ metamask, page }) => {
    await metamask.invokeSnap({
      request: {
        method: 'fil_configure',
        params: {
          configuration: { network: 't' },
        },
      },
      page,
    })

    /** @type {import('@chainsafe/filsnap-types').MessageGasEstimate} */
    const result = await metamask.invokeSnap({
      request: {
        method: 'fil_getBalance',
      },
      page,
    })

    expect(result).toBeTruthy()
  })

  test('should sign raw message', async ({ metamask, page }) => {
    await metamask.invokeSnap({
      request: {
        method: 'fil_configure',
        params: {
          configuration: { network: 't' },
        },
      },
      page,
    })

    metamask.on('notification', async (page) => {
      await expect(page.getByText('raw message', { exact: true })).toBeVisible()
      await page.getByRole('button').filter({ hasText: 'Approve' }).click()
    })

    /** @type {import('@chainsafe/filsnap-types').SignRawMessageResponse} */
    const result = await metamask.invokeSnap({
      request: {
        method: 'fil_signMessageRaw',
        params: { message: 'raw message' },
      },
      page,
    })

    expect(result).toStrictEqual({
      confirmed: true,
      // eslint-disable-next-line unicorn/no-null
      error: null,
      signature:
        'qwM8IkldjEZqTSy8dRiuxHkieagJCjRrVOJPHzPdrrYMxRvhJcjZUslGjslVSz8aOQEmdh8BznPGBUlz9dPPBgE=',
    })
  })

  test('should sign message', async ({ metamask, page }) => {
    const from = 't1pc2apytmdas3sn5ylwhfa32jfpx7ez7ykieelna'
    const to = 't1sfizuhpgjqyl4yjydlebncvecf3q2cmeeathzwi'
    await metamask.invokeSnap({
      request: {
        method: 'fil_configure',
        params: {
          configuration: { network: 't' },
        },
      },
      page,
    })

    metamask.on('notification', async (page) => {
      await expect(
        page.getByText(`It will be signed with address: ${from}`, {
          exact: true,
        })
      ).toBeVisible()
      await page.getByRole('button').filter({ hasText: 'Approve' }).click()
    })

    /** @type {import('@chainsafe/filsnap-types').MessageRequest} */
    const message = {
      to,
      value: '1',
    }
    /** @type {import('@chainsafe/filsnap-types').SignMessageResponse} */
    const result = await metamask.invokeSnap({
      request: {
        method: 'fil_signMessage',
        params: { message },
      },
      page,
    })
    expect(result).toMatchObject({
      confirmed: true,
      // eslint-disable-next-line unicorn/no-null
      error: null,
      signedMessage: {
        message: {
          from,
          method: 0,
          params: '',
          to,
          value: '1',
        },
        signature: {
          type: 1,
        },
      },
    })
  })

  test('should send message', async ({ metamask, page }) => {
    const from = 't1pc2apytmdas3sn5ylwhfa32jfpx7ez7ykieelna'
    const to = 't1sfizuhpgjqyl4yjydlebncvecf3q2cmeeathzwi'
    await metamask.invokeSnap({
      request: {
        method: 'fil_configure',
        params: {
          configuration: { network: 't' },
        },
      },
      page,
    })

    metamask.on('notification', async (page) => {
      await page.getByRole('button').filter({ hasText: 'Approve' }).click()
    })

    /** @type {import('@chainsafe/filsnap-types').MessageRequest} */
    const message = {
      to,
      value: '1',
    }
    /** @type {import('@chainsafe/filsnap-types').SignMessageResponse} */
    const signedMessageResponse = await metamask.invokeSnap({
      request: {
        method: 'fil_signMessage',
        params: { message },
      },
      page,
    })

    /** @type {import('@chainsafe/filsnap-types').MessageStatus} */
    const result = await metamask.invokeSnap({
      request: {
        method: 'fil_sendMessage',
        params: { signedMessage: signedMessageResponse.signedMessage },
      },
      page,
    })
    expect(result).toMatchObject({
      message: {
        from,
        method: 0,
        params: '',
        to,
        value: '1',
      },
    })
  })
})
