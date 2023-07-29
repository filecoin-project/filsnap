import { createFixture } from 'metamask-testing-tools'
import { type ExportPrivateKeyResponse } from '../../src/rpc/export-private-key'
import { type GetMessagesResponse } from '../../src/rpc/get-messages'
import {
  type GetAddressResponse,
  type GetPublicResponse,
} from '../../src/types'

const { test, expect } = createFixture({
  isolated: false,
  download: {
    flask: true,
  },
  snap: {
    id: 'local:http://localhost:8081',
    version: '*',
  },
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

  test('should get private key', async ({ metamask, page }) => {
    metamask.on('notification', (page) => {
      void page.getByRole('button').filter({ hasText: 'Approve' }).click()
    })
    const { result } = await metamask.invokeSnap<ExportPrivateKeyResponse>({
      request: {
        method: 'fil_exportPrivateKey',
      },
      page,
    })

    expect(result).toBe('IwTEHN6u6qxR76Lf8nkIm/JKLl9lRUAL0ulE80wOl/M=')
  })

  test('should get messages', async ({ metamask, page }) => {
    const { result } = await metamask.invokeSnap<GetMessagesResponse>({
      request: {
        method: 'fil_getMessages',
      },
      page,
    })

    expect(result).toStrictEqual([])
  })
})
