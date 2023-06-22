import { createFixture } from 'metamask-testing-tools'

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

test.describe('fil_configure', () => {
  test('should get configure for testnet', async ({ metamask, page }) => {
    /** @type {import('@chainsafe/filsnap-types').SnapConfig} */
    const result = await metamask.invokeSnap({
      request: {
        method: 'fil_configure',
        params: {
          configuration: { network: 't' },
        },
      },
      page,
    })

    expect(result).toStrictEqual({
      derivationPath: "m/44'/1'/0'/0/0",
      network: 't',
      rpc: { token: '', url: 'https://api.calibration.node.glif.io' },
      unit: {
        decimals: 6,
        image: 'https://cryptologos.cc/logos/filecoin-fil-logo.svg?v=007',
        symbol: 'FIL',
      },
    })
  })

  test('should get configure for main', async ({ metamask, page }) => {
    /** @type {import('@chainsafe/filsnap-types').SnapConfig} */
    const result = await metamask.invokeSnap({
      request: {
        method: 'fil_configure',
        params: {
          configuration: { network: 'f' },
        },
      },
      page,
    })

    expect(result).toStrictEqual({
      derivationPath: "m/44'/461'/0'/0/0",
      network: 'f',
      rpc: { token: '', url: 'https://api.node.glif.io' },
      unit: {
        decimals: 6,
        image: 'https://cryptologos.cc/logos/filecoin-fil-logo.svg?v=007',
        symbol: 'FIL',
      },
    })
  })

  test('should throw on bad cointype for mainnet', async ({
    metamask,
    page,
  }) => {
    /** @type {import('@chainsafe/filsnap-types').SnapConfig} */
    const configuration = {
      derivationPath: "m/44'/1'/0'/0/0",
      network: 'f',
      rpc: { token: '', url: 'https://api.node.glif.io' },
      unit: {
        decimals: 6,
        image: 'https://cryptologos.cc/logos/filecoin-fil-logo.svg?v=007',
        symbol: 'FIL',
      },
    }

    await expect(() => {
      return metamask.invokeSnap({
        request: {
          method: 'fil_configure',
          params: {
            configuration,
          },
        },
        page,
      })
    }).rejects.toThrow('Wrong CoinType in derivation path')
  })

  test('should throw on bad cointype for testnet', async ({
    metamask,
    page,
  }) => {
    /** @type {import('@chainsafe/filsnap-types').SnapConfig} */
    const configuration = {
      derivationPath: "m/44'/461'/0'/0/0",
      network: 't',
      rpc: { token: '', url: 'https://api.calibration.node.glif.io' },
      unit: {
        decimals: 6,
        image: 'https://cryptologos.cc/logos/filecoin-fil-logo.svg?v=007',
        symbol: 'FIL',
      },
    }

    await expect(() => {
      return metamask.invokeSnap({
        request: {
          method: 'fil_configure',
          params: {
            configuration,
          },
        },
        page,
      })
    }).rejects.toThrow('Wrong CoinType in derivation path')
  })

  test('should throw on mismatch between network and rpc', async ({
    metamask,
    page,
  }) => {
    /** @type {import('@chainsafe/filsnap-types').SnapConfig} */
    const configuration = {
      derivationPath: "m/44'/1'/0'/0/0",
      network: 't',
      rpc: { token: '', url: 'https://api.node.glif.io' },
      unit: {
        decimals: 6,
        image: 'https://cryptologos.cc/logos/filecoin-fil-logo.svg?v=007',
        symbol: 'FIL',
      },
    }

    await expect(() => {
      return metamask.invokeSnap({
        request: {
          method: 'fil_configure',
          params: {
            configuration,
          },
        },
        page,
      })
    }).rejects.toThrow(
      'Mismatch between configured network and network provided by RPC'
    )
  })
})
