import { createFixture } from 'metamask-testing-tools'
import type { ConfigureRequest, ConfigureResponse } from '../src/rpc/configure'
import type { GetAddressResponse } from '../src/types'

const { test, expect } = createFixture({
  isolated: false,
  downloadOptions: {
    flask: true,
    tag: 'v11.16.5',
  },
  snap: {
    id: 'local:http://localhost:8081',
    version: '*',
  },
})

test.describe('API Errors', () => {
  test('should throw on bad cointype for mainnet', async ({
    metamask,
    page,
  }) => {
    const configuration = {
      derivationPath: "m/44'/1'/0'/0/0",
      network: 'mainnet',
      rpc: { token: '', url: 'https://api.node.glif.io' },
      unit: {
        decimals: 18,
        symbol: 'FIL',
      },
    } satisfies ConfigureRequest['params']

    const response = await metamask.invokeSnap<ConfigureResponse>({
      request: {
        method: 'fil_configure',
        params: configuration,
      } satisfies ConfigureRequest,
      page,
    })

    expect(response.error?.message).toBe(
      'For mainnet, CoinType must be 461 but got 1'
    )
  })

  test('should throw on bad cointype for testnet', async ({
    metamask,
    page,
  }) => {
    const configuration = {
      derivationPath: "m/44'/461'/0'/0/0",
      network: 'testnet',
      rpc: { token: '', url: 'https://api.calibration.node.glif.io' },
      unit: {
        decimals: 18,
        symbol: 'FIL',
      },
    } satisfies ConfigureRequest['params']

    const response = await metamask.invokeSnap<ConfigureResponse>({
      request: {
        method: 'fil_configure',
        params: configuration,
      } satisfies ConfigureRequest,
      page,
    })

    expect(response.error?.message).toBe(
      'For testnet, CoinType must be 1 but got 461'
    )
  })

  test('should throw on mismatch between network and rpc', async ({
    metamask,
    page,
  }) => {
    const configuration = {
      derivationPath: "m/44'/1'/0'/0/0",
      network: 'testnet',
      rpc: { token: '', url: 'https://api.node.glif.io' },
      unit: {
        decimals: 18,
        symbol: 'FIL',
      },
    } satisfies ConfigureRequest['params']

    const response = await metamask.invokeSnap<ConfigureResponse>({
      request: {
        method: 'fil_configure',
        params: configuration,
      } satisfies ConfigureRequest,
      page,
    })

    expect(response.error?.message).toBe(
      'Mismatch between configured network and network provided by RPC'
    )
  })

  test('should throw on invalid params', async ({ metamask, page }) => {
    const configuration = {
      derivationPath: "m/44'/1'/0'/0/0",
      // @ts-expect-error - testing
      network: 'RANDOM_NETWORK',
      rpc: { token: '', url: 'https://api.node.glif.io' },
      unit: {
        decimals: 18,
        symbol: 'FIL',
      },
    } satisfies ConfigureRequest['params']

    const response = await metamask.invokeSnap<ConfigureResponse>({
      request: {
        method: 'fil_configure',
        // @ts-expect-error - testing
        params: configuration,
      } satisfies ConfigureRequest,
      page,
    })

    expect(response.error?.message).toContain('Invalid params')
  })

  test('should throw on invalid derivation path', async ({
    metamask,
    page,
  }) => {
    const configuration = {
      derivationPath: "m/45'/1'/0'/",
    } satisfies ConfigureRequest['params']

    const response = await metamask.invokeSnap<ConfigureResponse>({
      request: {
        method: 'fil_configure',
        params: configuration,
      } satisfies ConfigureRequest,
      page,
    })

    expect(response.error?.message).toContain(
      'Invalid derivation path: depth must be 5'
    )
  })

  test('should throw on invalid derivation path purpose', async ({
    metamask,
    page,
  }) => {
    const configuration = {
      derivationPath: "m/46'/1'/0'/0/0",
    } satisfies ConfigureRequest['params']

    const response = await metamask.invokeSnap<ConfigureResponse>({
      request: {
        method: 'fil_configure',
        params: configuration,
      } satisfies ConfigureRequest,
      page,
    })

    expect(response.error?.message).toContain('Invalid derivation path')
  })

  test('should fail fil_getAddress when not connected', async ({
    metamask,
    page,
  }) => {
    const { error } = await metamask.invokeSnap<GetAddressResponse>({
      request: {
        method: 'fil_getAddress',
      },
      page,
    })

    expect(error?.message).toContain(
      'No configuration found for http://example.org. Connect to Filsnap first.'
    )
  })

  test('should fail fil_getAccountInfo when not connected', async ({
    metamask,
    page,
  }) => {
    const { error } = await metamask.invokeSnap<GetAddressResponse>({
      request: {
        method: 'fil_getAccountInfo',
      },
      page,
    })

    expect(error?.message).toContain(
      'No configuration found for http://example.org. Connect to Filsnap first.'
    )
  })

  test('should fail fil_getPublicKey when not connected', async ({
    metamask,
    page,
  }) => {
    const { error } = await metamask.invokeSnap<GetAddressResponse>({
      request: {
        method: 'fil_getPublicKey',
      },
      page,
    })

    expect(error?.message).toContain(
      'No configuration found for http://example.org. Connect to Filsnap first.'
    )
  })

  test('should fail fil_exportPrivateKey when not connected', async ({
    metamask,
    page,
  }) => {
    const { error } = await metamask.invokeSnap<GetAddressResponse>({
      request: {
        method: 'fil_exportPrivateKey',
      },
      page,
    })

    expect(error?.message).toContain(
      'No configuration found for http://example.org. Connect to Filsnap first.'
    )
  })

  test('should fail fil_getBalance when not connected', async ({
    metamask,
    page,
  }) => {
    const { error } = await metamask.invokeSnap<GetAddressResponse>({
      request: {
        method: 'fil_getBalance',
      },
      page,
    })

    expect(error?.message).toContain(
      'No configuration found for http://example.org. Connect to Filsnap first.'
    )
  })

  test('should fail fil_signMessage when not connected', async ({
    metamask,
    page,
  }) => {
    const { error } = await metamask.invokeSnap<GetAddressResponse>({
      request: {
        method: 'fil_signMessage',
      },
      page,
    })

    expect(error?.message).toContain(
      'No configuration found for http://example.org. Connect to Filsnap first.'
    )
  })

  test('should fail fil_signMessageRaw when not connected', async ({
    metamask,
    page,
  }) => {
    const { error } = await metamask.invokeSnap<GetAddressResponse>({
      request: {
        method: 'fil_signMessageRaw',
      },
      page,
    })

    expect(error?.message).toContain(
      'No configuration found for http://example.org. Connect to Filsnap first.'
    )
  })
  test('should fail fil_sendMessage when not connected', async ({
    metamask,
    page,
  }) => {
    const { error } = await metamask.invokeSnap<GetAddressResponse>({
      request: {
        method: 'fil_sendMessage',
      },
      page,
    })

    expect(error?.message).toContain(
      'No configuration found for http://example.org. Connect to Filsnap first.'
    )
  })

  test('should fail fil_getGasForMessage when not connected', async ({
    metamask,
    page,
  }) => {
    const { error } = await metamask.invokeSnap<GetAddressResponse>({
      request: {
        method: 'fil_getGasForMessage',
      },
      page,
    })

    expect(error?.message).toContain(
      'No configuration found for http://example.org. Connect to Filsnap first.'
    )
  })

  test('should fail when not support method', async ({ metamask, page }) => {
    const { error } = await metamask.invokeSnap<GetAddressResponse>({
      request: {
        method: 'fil_NotSupportMethod',
      },
      page,
    })

    expect(error?.message).toContain(
      'Unsupported RPC method: "fil_NotSupportMethod" failed'
    )
  })
})
