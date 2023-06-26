import { expect } from '../../utils'
import { getBalance } from '../../../src/rpc/getBalance'
import { LotusApiMock } from '../lotusapi-mock'
import { mockSnapProvider } from '../wallet-mock'
import { getKeyPair } from '../../../src/keypair'

describe('Test rpc handler function: getBalance', function () {
  const walletStub = mockSnapProvider()
  const rpcStub = new LotusApiMock()

  afterEach(function () {
    walletStub.reset()
    rpcStub.reset()
  })

  it('should return balance on saved keyring in state', async function () {
    // prepare stubs
    walletStub.prepareFoKeyPair()
    const account = await getKeyPair(walletStub)
    rpcStub.balance.returns('30000000')
    // call getBalance
    // @ts-expect-error - test code
    const result = await getBalance({ snap: walletStub, rpc: rpcStub, account })
    // assertions
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_getBip44Entropy).to.have.been.calledOnce()
    expect(result).to.be.eq('30000000')
  })
})
