import { createFixture } from 'metamask-testing-tools'
import { type GetMessagesResponse } from '../../src/rpc/get-messages'
import {
  type SendMessageResponse,
  type SendMessageRequest,
} from '../../src/rpc/send-message'
import {
  type SignMessageResponse,
  type SignMessageRequest,
} from '../../src/rpc/sign-message'

const { test, expect } = createFixture({
  isolated: true,
  download: {
    flask: true,
  },
  snap: {
    id: 'local:http://localhost:8081',
  },
})

test.beforeEach(async ({ metamask, page }) => {
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

test.describe('snap messages', () => {
  test('should get messages', async ({ metamask, page }) => {
    const { result } = await metamask.invokeSnap<GetMessagesResponse>({
      request: {
        method: 'fil_getMessages',
      },
      page,
    })

    expect(result).toStrictEqual([])
  })

  test('should get one message after a send message', async ({
    metamask,
    page,
  }) => {
    const from = 't1pc2apytmdas3sn5ylwhfa32jfpx7ez7ykieelna'
    const to = 't1sfizuhpgjqyl4yjydlebncvecf3q2cmeeathzwi'

    metamask.on('notification', async (page) => {
      await page.getByRole('button').filter({ hasText: 'Approve' }).click()
    })

    const message = {
      to,
      value: '10',
    }
    const signedMessageResponse =
      await metamask.invokeSnap<SignMessageResponse>({
        request: {
          method: 'fil_signMessage',
          params: message,
        } satisfies SignMessageRequest,
        page,
      })

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

    const messagesResponse = await metamask.invokeSnap<GetMessagesResponse>({
      request: {
        method: 'fil_getMessages',
      },
      page,
    })

    if (messagesResponse.error != null) {
      throw new Error('Failed to get messages')
    }

    expect(messagesResponse.result.length).toBe(1)
    expect(messagesResponse.result[0].cid).toBeDefined()
    expect(messagesResponse.result[0]).toMatchObject({
      message: {
        from,
        method: 0,
        params: '',
        to,
        value: '10',
      },
    })
  })
})
