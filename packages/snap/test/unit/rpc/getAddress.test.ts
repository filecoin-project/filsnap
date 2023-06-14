import { getAddress } from '../../../src/rpc/getAddress.js'
import { expect } from '../../utils.js'
import { mockSnapProvider } from '../wallet.mock.test.js'
import { testAddress, testBip44Entropy } from './keyPairTestConstants.js'
import * as Constants from '../../../src/constants.js'

describe('Test rpc handler function: getAddress', function () {
  const walletStub = mockSnapProvider()

  afterEach(function () {
    walletStub.reset()
  })

  it('should return valid address', async function () {
    walletStub.prepareFoKeyPair()

    const result = await getAddress(walletStub)

    expect(result).to.be.eq(testAddress)
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_getBip44Entropy).to.have.been.calledOnce()
  })

  it('should respect all derivation path fields', async function () {
    walletStub.rpcStubs.snap_getBip44Entropy.resolves(testBip44Entropy)
    walletStub.rpcStubs.snap_manageState
      .withArgs({ operation: 'get' })
      .resolves({
        filecoin: {
          config: {
            ...Constants.mainnetConfig,
            derivationPath: "m/44'/461'/1'/0/0",
            network: 'f',
          },
          messages: [],
        },
      })
    let result = await getAddress(walletStub)
    expect(result).to.not.be.eq(testAddress)
    expect(result).to.not.be.null()

    walletStub.rpcStubs.snap_manageState
      .withArgs({ operation: 'get' })
      .resolves({
        filecoin: {
          config: {
            ...Constants.mainnetConfig,
            derivationPath: "m/44'/461'/0'/1/0",
            network: 'f',
          },
          messages: [],
        },
      })
    result = await getAddress(walletStub)
    expect(result).to.not.be.eq(testAddress)
    expect(result).to.not.be.null()

    walletStub.rpcStubs.snap_manageState
      .withArgs({ operation: 'get' })
      .resolves({
        filecoin: {
          config: {
            ...Constants.mainnetConfig,
            derivationPath: "m/44'/461'/0'/0/1",
            network: 'f',
          },
          messages: [],
        },
      })
    result = await getAddress(walletStub)
    expect(result).to.not.be.eq(testAddress)
    expect(result).to.not.be.null()
  })
})
