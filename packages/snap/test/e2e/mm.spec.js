import { createFixture } from 'metamask-testing-tools'

const { test, expect } = createFixture({
  download: {
    flask: true,
  },
  snap: {
    snapId: 'local:http://localhost:8081',
  },
})

test.describe('filsnap api with default seed', () => {
  test('should get address mainnet', async ({ page, metamask }) => {
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
})
