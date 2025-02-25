import { createFixture } from 'metamask-testing-tools'
import type { FilSnapMethods } from '../src'
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
  test.beforeEach(async ({ metamask }) => {
    await metamask.page.getByTestId('confirmation-submit-button').click()
  })
  test('should get configure for testnet', async ({ metamask, page }) => {
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

  test('should get change account with fil_setConfig', async ({
    metamask,
    page,
  }) => {
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

    expect(response.result?.derivationPath).toStrictEqual("m/44'/1'/0'/0/0")
    expect(response.result?.network).toStrictEqual('testnet')

    const req1 = metamask.invokeSnap<
      ReturnType<FilSnapMethods['fil_setConfig']>
    >({
      request: {
        method: 'fil_setConfig',
        params: {
          index: 1,
        } satisfies Parameters<FilSnapMethods['fil_setConfig']>[1],
      },
      page,
    })

    await metamask.waitForConfirmation()
    const rsp1 = await req1
    expect(rsp1.result?.account.path).toStrictEqual("m/44'/1'/0'/0/1")
    expect(rsp1.result?.config.network).toStrictEqual('testnet')

    const req2 = metamask.invokeSnap<
      ReturnType<FilSnapMethods['fil_setConfig']>
    >({
      request: {
        method: 'fil_setConfig',
        params: {
          network: 'mainnet',
        } satisfies Parameters<FilSnapMethods['fil_setConfig']>[1],
      },
      page,
    })

    await metamask.waitForConfirmation()
    const rsp2 = await req2
    expect(rsp2.result?.account.path).toStrictEqual("m/44'/461'/0'/0/1")
    expect(rsp2.result?.config.network).toStrictEqual('mainnet')
  })

  test('should connect with fil_setConfig', async ({ metamask, page }) => {
    const req1 = metamask.invokeSnap<
      ReturnType<FilSnapMethods['fil_setConfig']>
    >({
      request: {
        method: 'fil_setConfig',
      },
      page,
    })

    await metamask.waitForConfirmation()
    const rsp1 = await req1
    expect(rsp1.result?.account.path).toStrictEqual("m/44'/461'/0'/0/0")
    expect(rsp1.result?.config.network).toStrictEqual('mainnet')
  })

  test('should fail to connect with fil_setConfig using bad url', async ({
    metamask,
    page,
  }) => {
    const req1 = metamask.invokeSnap<
      ReturnType<FilSnapMethods['fil_setConfig']>
    >({
      request: {
        method: 'fil_setConfig',
        params: {
          rpcUrl: 'https://api.calibration.node.glif.io',
        } satisfies Parameters<FilSnapMethods['fil_setConfig']>[1],
      },
      page,
    })

    const rsp1 = await req1
    expect(rsp1.error).toBeDefined()
    expect(rsp1.error?.message).toStrictEqual(
      'Mismatch between configured network and network provided by RPC'
    )
  })

  test('should not prompt confirmation if config is already set', async ({
    metamask,
    page,
  }) => {
    const req1 = metamask.invokeSnap<
      ReturnType<FilSnapMethods['fil_setConfig']>
    >({
      request: {
        method: 'fil_setConfig',
      },
      page,
    })
    await metamask.waitForConfirmation()
    const rsp1 = await req1
    expect(rsp1.result?.config.network).toStrictEqual('mainnet')

    const req2 = metamask.invokeSnap<
      ReturnType<FilSnapMethods['fil_setConfig']>
    >({
      request: {
        method: 'fil_setConfig',
        params: { network: 'mainnet' },
      },
      page,
    })
    const rsp2 = await req2
    expect(rsp2.result?.config.network).toStrictEqual('mainnet')
  })
})
