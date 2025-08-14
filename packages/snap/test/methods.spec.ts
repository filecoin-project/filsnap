import { base64pad, hex } from 'iso-base/rfc4648'
import { utf8 } from 'iso-base/utf8'
import { Signature } from 'iso-filecoin/signature'
import * as Wallet from 'iso-filecoin/wallet'
import { createFixture } from 'metamask-testing-tools'
import type { ExportPrivateKeyResponse } from '../src/rpc/export-private-key'
import type { GetBalanceResponse } from '../src/rpc/get-balance'
import type {
  SendMessageRequest,
  SendMessageResponse,
} from '../src/rpc/send-message'
import type {
  SignMessageRawRequest,
  SignMessageRawResponse,
  SignMessageRequest,
  SignMessageResponse,
} from '../src/rpc/sign-message'
import type { GetAddressResponse, GetPublicResponse } from '../src/types'

const { test, expect } = createFixture({
  isolated: false,
  downloadOptions: {
    flask: true,
  },
  snap: {
    id: 'local:http://localhost:8080',
  },
})

test.beforeAll(async ({ metamask, page }) => {
  await metamask.page.getByTestId('confirmation-submit-button').click()
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

    await metamask.waitForConfirmation()
    await metamask.waitForConfirmation()

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

  test('should sign bytes', async ({ metamask, page }) => {
    const signRaw = metamask.invokeSnap<SignMessageRawResponse>({
      request: {
        method: 'fil_sign',
        params: { data: base64pad.encode('hello') },
      },
      page,
    })

    await metamask.waitForConfirmation()
    const { result } = await signRaw

    expect(result).toStrictEqual(
      '018138db7b1267f8a47a137ee18807971a51881aabb9e6c190c315ba98daaf7eed3fd664bba43d5b0a2056592049840305280b8748dae59714ea21599ae1397cbb01'
    )
  })

  test('should sign personal bytes', async ({ metamask, page }) => {
    const signRaw = metamask.invokeSnap<SignMessageRawResponse>({
      request: {
        method: 'fil_personalSign',
        params: { data: base64pad.encode('hello') },
      },
      page,
    })

    await metamask.waitForConfirmation()
    const { result } = await signRaw

    if (result == null) {
      throw new Error('Failed to sign message')
    }

    const signature = Signature.fromLotusHex(result)
    const isValid = Wallet.personalVerify(
      signature,
      utf8.decode('hello'),
      hex.decode(
        '047d5c5bf2aeec3efaf909de110e34d0b8f50b490e1fe0d24b635cc270bfcb1dafc959e5abba30cf6b4d8029fc16f22eb0f8f137f0284113157766b5aa8a5fae76'
      )
    )

    expect(isValid).toBe(true)
  })

  test('should sign raw message', async ({ metamask, page }) => {
    const signRaw = metamask.invokeSnap<SignMessageRawResponse>({
      request: {
        method: 'fil_signMessageRaw',
        params: { message: 'raw message' },
      } satisfies SignMessageRawRequest,
      page,
    })

    await metamask.waitForConfirmation()
    const { result } = await signRaw

    expect(result).toStrictEqual(
      'WNtAyos6hGibMdT1XXIJTLLTXYg1nWrtKL7fcL/8jMQDSf72NYlbfxZojWPNJVbbrDCeZVXLygtgZt+ttPVv7AE='
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

    expect(error?.message).toContain('✖ Invalid input\n  → at message')
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

    await metamask.waitForConfirmation()
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

    await metamask.waitForConfirmation()
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
