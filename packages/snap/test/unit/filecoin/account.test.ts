import { expect } from '../../utils'
import { getKeyPair } from '../../../src/keypair'
import {
  testAddress,
  testBip44Entropy,
  testPrivateKeyBase64,
  testPublicKey,
} from '../rpc/fixtures'
import { mockSnapProvider } from '../wallet-mock'
import { base16, base64pad } from 'iso-base/rfc4648'

describe('Test account function: getKeyPair', function () {
  const walletStub = mockSnapProvider()

  afterEach(function () {
    walletStub.reset()
  })

  it('should return valid keypair for filecoin mainnnet with new version of metamask', async function () {
    walletStub.rpcStubs.snap_manageState
      .withArgs({ operation: 'get' })
      .resolves({
        filecoin: {
          config: {
            derivationPath: "m/44'/461'/0'/0/0",
            network: 'f',
          },
        },
      })

    walletStub.rpcStubs.snap_getBip44Entropy.resolves(testBip44Entropy)
    // ensure our call to getBip44Entropy returns the correct entropy
    walletStub.requestStub.resolves(testBip44Entropy)

    const result = await getKeyPair(walletStub)

    expect(base16.encode(result.pubKey).toLowerCase()).to.be.eq(testPublicKey)
    expect(result.address.toString()).to.be.eq(testAddress)
    expect(base64pad.encode(result.privateKey)).to.be.eq(testPrivateKeyBase64)
  })
})
