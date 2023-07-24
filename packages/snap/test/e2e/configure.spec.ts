import { createFixture } from 'metamask-testing-tools'
import { type ConfigureRequest, type ConfigureResponse } from '../../src/index'

const { test, expect } = createFixture({
  isolated: false,
  download: {
    flask: true,
  },
  snap: {
    id: 'local:http://localhost:8081',
  },
})

test.describe('fil_configure', () => {
  test('should get configure for testnet', async ({ metamask, page }) => {
    const response = await metamask.invokeSnap<ConfigureResponse>({
      request: {
        method: 'fil_configure',
        params: {
          network: 'testnet',
        },
      } satisfies ConfigureRequest,
      page,
    })

    expect(response.result).toStrictEqual({
      derivationPath: "m/44'/1'/0'/0/0",
      network: 'testnet',
      rpc: { token: '', url: 'https://api.calibration.node.glif.io' },
      unit: {
        decimals: 18,
        image: 'https://filecoin.io/images/filecoin-logo.svg',
        symbol: 'tFIL',
      },
    })
  })

  test('should get configure for main', async ({ metamask, page }) => {
    const response = await metamask.invokeSnap<ConfigureResponse>({
      request: {
        method: 'fil_configure',
        params: {
          network: 'mainnet',
        },
      } satisfies ConfigureRequest,
      page,
    })

    expect(response.result).toStrictEqual({
      derivationPath: "m/44'/461'/0'/0/0",
      network: 'mainnet',
      rpc: { token: '', url: 'https://api.node.glif.io' },
      unit: {
        decimals: 18,
        image: 'https://filecoin.io/images/filecoin-logo.svg',
        symbol: 'FIL',
      },
    })
  })

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
        image: 'https://filecoin.io/images/filecoin-logo.svg',
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
        image: 'https://filecoin.io/images/filecoin-logo.svg',
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
        image: 'https://filecoin.io/images/filecoin-logo.svg',
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
        image: 'https://filecoin.io/images/filecoin-logo.svg',
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

    expect(response.error?.message).toBe(
      'RPC method "fil_configure" failed - Invalid derivation path: depth must be 5 "m / purpose\' / coin_type\' / account\' / change / address_index"'
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

    expect(response.error?.message).toContain(
      'Invalid derivation path: The "purpose" node (depth 1) must be the string "44\'"'
    )
  })
})
