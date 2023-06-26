import { expect } from '../../utils'
import { getKeyPair } from '../../../src/filecoin/account'
import { mockSnapProvider } from '../wallet-mock'
import { testPublicKey } from './keyPairTestConstants'
import { base16 } from 'iso-base/rfc4648'

describe('Test rpc handler function: getPublicKey', function () {
  const walletStub = mockSnapProvider()

  afterEach(function () {
    walletStub.reset()
  })

  it('should return valid address', async function () {
    walletStub.prepareFoKeyPair()

    const result = await getKeyPair(walletStub)

    expect(base16.encode(result.pubKey).toLowerCase()).to.be.eq(testPublicKey)
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_getBip44Entropy).to.have.been.calledOnce()
  })
})
