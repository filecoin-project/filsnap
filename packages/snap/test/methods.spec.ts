import { createFixture } from 'metamask-testing-tools'
import { type ExportPrivateKeyResponse } from '../src/rpc/export-private-key'
import { type GetBalanceResponse } from '../src/rpc/get-balance'
import {
  type SendMessageResponse,
  type SendMessageRequest,
} from '../src/rpc/send-message'
import {
  type SignMessageRawResponse,
  type SignMessageRawRequest,
  type SignMessageResponse,
  type SignMessageRequest,
} from '../src/rpc/sign-message'
import { type GetAddressResponse, type GetPublicResponse } from '../src/types'

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
  const req = metamask.invokeSnap({
    request: {
      method: 'fil_configure',
      params: {
        network: 'testnet',
      },
    },
    page,
  })

  const dialog = await metamask.waitForDialog('confirmation')
  await dialog.getByRole('button').filter({ hasText: 'Approve' }).click()

  await req
})

test.describe('filsnap testnet', () => {
  test('should get address', async ({ metamask, page }) => {
    const { result } = await metamask.invokeSnap<GetAddressResponse>({
      request: {
        method: 'fil_getAddress',
      },
      page,
    })

    expect(result).toBe('t1pc2apytmdas3sn5ylwhfa32jfpx7ez7ykieelna')
  })

  test('should get public key', async ({ metamask, page }) => {
    const { result } = await metamask.invokeSnap<GetPublicResponse>({
      request: {
        method: 'fil_getPublicKey',
      },
      page,
    })

    expect(result).toBe(
      '047d5c5bf2aeec3efaf909de110e34d0b8f50b490e1fe0d24b635cc270bfcb1dafc959e5abba30cf6b4d8029fc16f22eb0f8f137f0284113157766b5aa8a5fae76'
    )
  })

  test('should get private key', async ({ metamask, page }) => {
    const privateKey = metamask.invokeSnap<ExportPrivateKeyResponse>({
      request: {
        method: 'fil_exportPrivateKey',
      },
      page,
    })

    const dialog1 = await metamask.waitForDialog('confirmation')
    await dialog1.getByRole('button').filter({ hasText: 'Approve' }).click()

    const dialog2 = await metamask.waitForDialog('confirmation')
    await dialog2.locator('.confirmation-footer__actions > button').click()
    const { result } = await privateKey

    expect(result).toBe(true)
  })

  test('should get balance', async ({ metamask, page }) => {
    const { result } = await metamask.invokeSnap<GetBalanceResponse>({
      request: {
        method: 'fil_getBalance',
      },
      page,
    })

    expect(result).toBeTruthy()
  })

  test('should sign raw message', async ({ metamask, page }) => {
    const signRaw = metamask.invokeSnap<SignMessageRawResponse>({
      request: {
        method: 'fil_signMessageRaw',
        params: { message: 'raw message' },
      } satisfies SignMessageRawRequest,
      page,
    })

    const dialog = await metamask.waitForDialog('confirmation')
    await dialog.getByRole('button').filter({ hasText: 'Approve' }).click()
    const { result } = await signRaw

    expect(result).toStrictEqual(
      'BjNeqpqxb9CdnxVbE3J8YGHMg9kZjAz95mnnlASUSGgluIhTvaNRB5/Qx5/dKXqzBvpSclOXQfkeeRvqvo3jqAA='
    )
  })

  test('should fail to sign bad raw message', async ({ metamask, page }) => {
    const { error } = await metamask.invokeSnap<SignMessageRawResponse>({
      request: {
        method: 'fil_signMessageRaw',
        params: { message: 111 },
      },
      page,
    })

    expect(error?.message).toContain('Expected string, received number')
  })

  test('should sign message', async ({ metamask, page }) => {
    const from = 't1pc2apytmdas3sn5ylwhfa32jfpx7ez7ykieelna'
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

    const dialog = await metamask.waitForDialog('confirmation')
    await dialog.getByRole('button').filter({ hasText: 'Approve' }).click()
    const { result } = await sign

    if (result == null) {
      throw new Error('Failed to sign message')
    }

    expect(result).toMatchObject({
      message: {
        to,
        from,
        method: 0,
        params: '',
        value: '1',
      },
      signature: {
        type: 'SECP256K1',
      },
    })
  })

  test('should send message', async ({ metamask, page }) => {
    const from = 't1pc2apytmdas3sn5ylwhfa32jfpx7ez7ykieelna'
    const to = 't1sfizuhpgjqyl4yjydlebncvecf3q2cmeeathzwi'

    const message = {
      to,
      value: '1',
    }
    const invoke = metamask.invokeSnap<SignMessageResponse>({
      request: {
        method: 'fil_signMessage',
        params: message,
      } satisfies SignMessageRequest,
      page,
    })

    const dialog = await metamask.waitForDialog('confirmation')
    await dialog.getByRole('button').filter({ hasText: 'Approve' }).click()
    const signedMessageResponse = await invoke

    if (signedMessageResponse.error != null) {
      throw new Error(signedMessageResponse.error.message)
    }

    const sendResponse = await metamask.invokeSnap<SendMessageResponse>({
      request: {
        method: 'fil_sendMessage',
        params: {
          message: signedMessageResponse.result.message,
          signature: signedMessageResponse.result.signature,
        },
      } satisfies SendMessageRequest,
      page,
    })

    if (sendResponse.error != null) {
      throw new Error(sendResponse.error.message)
    }

    expect(sendResponse.result).toMatchObject({
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
