import { getKeyPair } from '../../../src/filecoin/account'
import { expect } from '../../utils'
import { mockSnapProvider } from '../wallet-mock'
import { testAddress, testBip44Entropy } from './keyPairTestConstants'
import * as Constants from '../../../src/constants'

describe('Test rpc handler function: getAddress', function () {
  const walletStub = mockSnapProvider()

  afterEach(function () {
    walletStub.reset()
  })

  it('should return valid address', async function () {
    walletStub.prepareFoKeyPair()

    const result = await getKeyPair(walletStub)

    expect(result.address.toString()).to.be.eq(testAddress)
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
    let result = await getKeyPair(walletStub)
    expect(result.address).to.not.be.eq(testAddress)
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
    result = await getKeyPair(walletStub)
    expect(result.address).to.not.be.eq(testAddress)
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
    result = await getKeyPair(walletStub)
    expect(result.address).to.not.be.eq(testAddress)
    expect(result).to.not.be.null()
  })
})
