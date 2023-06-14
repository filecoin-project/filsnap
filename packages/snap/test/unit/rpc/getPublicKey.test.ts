import { expect } from '../../utils.js'
import { getPublicKey } from '../../../src/rpc/getPublicKey.js'
import { mockSnapProvider } from '../wallet.mock.test.js'
import { testPublicKey } from './keyPairTestConstants.js'

describe('Test rpc handler function: getPublicKey', function () {
  const walletStub = mockSnapProvider()

  afterEach(function () {
    walletStub.reset()
  })

  it('should return valid address', async function () {
    walletStub.prepareFoKeyPair()

    const result = await getPublicKey(walletStub)

    expect(result).to.be.eq(testPublicKey)
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_getBip44Entropy).to.have.been.calledOnce()
  })
})
