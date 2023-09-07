import { expect } from '../../utils'
import { exportPrivateKey } from '../../../src/rpc/export-private-key'
import { mockSnapProvider } from '../wallet-mock'
import { getKeyPair } from '../../../src/keypair'
import * as Constants from '../../../src/constants'

describe('Test rpc handler function: exportSeed', function () {
  const walletStub = mockSnapProvider()

  afterEach(function () {
    walletStub.reset()
  })

  it('should return seed on positive prompt confirmation and keyring saved in state', async function () {
    walletStub.rpcStubs.snap_dialog.resolves(true)
    walletStub.prepareFoKeyPair()
    const account = await getKeyPair(walletStub)
    // @ts-expect-error - test code
    const result = await exportPrivateKey({
      snap: walletStub,
      account,
      config: Constants.mainnetConfig,
    })

    expect(walletStub.rpcStubs.snap_dialog).to.have.been.calledTwice()
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_getBip44Entropy).to.have.been.calledOnce()

    expect(result.result).to.be.eq(true)
  })

  it('should not return seed on negative prompt confirmation', async function () {
    walletStub.rpcStubs.snap_dialog.resolves(false)
    walletStub.prepareFoKeyPair()
    const account = await getKeyPair(walletStub)
    // @ts-expect-error - test code
    const result = await exportPrivateKey({
      snap: walletStub,
      account,
      config: Constants.mainnetConfig,
    })

    expect(walletStub.rpcStubs.snap_dialog).to.have.been.calledOnce()
    expect(result.result).to.be.null()
  })
})
