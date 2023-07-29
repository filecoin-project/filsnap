import { expect } from '../../utils'
import { signMessage } from '../../../src/rpc/sign-message'
import { LotusApiMock } from '../lotusapi-mock'
import { mockSnapProvider } from '../wallet-mock'
import { getKeyPair } from '../../../src/keypair'
import * as Constants from '../../../src/constants'

describe('Test rpc handler function: signMessage', function () {
  const walletStub = mockSnapProvider()
  const apiStub = new LotusApiMock()

  const messageRequest = {
    version: 0,
    to: 't12flyjpedjjqlrr2dmlnrtbh62qav3b3h7o7lohy',
    value: '5000000000000000',
  }

  const fullMessage = {
    ...messageRequest,
    from: 'f1ekszptik2ognlx24xz7zubejtw3cyidv4t4ibyy',
    gasFeeCap: '10',
    gasLimit: 1000,
    gasPremium: '10',
    method: 0,
    nonce: 0,
    params: '',
  }

  const paramsMessage = {
    ...messageRequest,
    from: 'f1ekszptik2ognlx24xz7zubejtw3cyidv4t4ibyy',
    gasFeeCap: '10',
    gasLimit: 1000,
    gasPremium: '10',
    method: 0,
    nonce: 0,
    params: 'bugugugu',
  }

  afterEach(function () {
    walletStub.reset()
    apiStub.reset()
  })

  it('should successfully sign valid message without gas params on positive prompt', async function () {
    walletStub.rpcStubs.snap_dialog.resolves(true)
    walletStub.prepareFoKeyPair()
    const account = await getKeyPair(walletStub)

    apiStub.nonce.returns({ result: 0 })
    apiStub.gasEstimate.returns({
      result: {
        GasPremium: '10',
        GasFeeCap: '10',
        GasLimit: 1000,
      },
    })

    const response = await signMessage(
      {
        snap: walletStub,
        // @ts-expect-error - test code
        rpc: apiStub,
        account,
        config: {
          ...Constants.testnetConfig,
        },
      },
      messageRequest
    )

    expect(walletStub.rpcStubs.snap_dialog).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_getBip44Entropy).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledOnce()
    expect(apiStub.nonce).to.have.been.calledOnce()
    expect(apiStub.gasEstimate).to.have.been.calledOnce()

    expect(response).to.containSubset({
      error: null,
      result: {
        message: fullMessage,
        signature: {
          type: 'SECP256K1',
          data: (expected: string) => typeof expected === 'string',
        },
      },
    })
  })

  it('should successfully sign valid message with gas params on positive prompt', async function () {
    walletStub.rpcStubs.snap_dialog.resolves(true)
    walletStub.prepareFoKeyPair()
    const account = await getKeyPair(walletStub)

    apiStub.nonce.returns({ result: 0 })
    apiStub.gasEstimate.returns({
      result: {
        GasPremium: '10',
        GasFeeCap: '10',
        GasLimit: 1000,
      },
    })

    const messageRequestWithGasParams = {
      ...messageRequest,
      gasFeeCap: '10',
      gasLimit: 1000,
      gasPremium: '10',
      nonce: 1,
    }
    const response = await signMessage(
      {
        snap: walletStub,
        // @ts-expect-error - test code
        rpc: apiStub,
        account,
        config: {
          ...Constants.testnetConfig,
        },
      },
      messageRequestWithGasParams
    )

    expect(walletStub.rpcStubs.snap_dialog).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_getBip44Entropy).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledOnce()
    expect(apiStub.nonce).to.have.not.been.called()

    expect(response).to.containSubset({
      error: null,
      result: {
        message: {
          ...fullMessage,
          nonce: 1,
        },
        signature: {
          type: 'SECP256K1',
          data: (expected: string) => typeof expected === 'string',
        },
      },
    })
  })

  it('should successfully sign valid message with custom params on positive prompt', async function () {
    walletStub.rpcStubs.snap_dialog.resolves(true)
    walletStub.prepareFoKeyPair()
    const account = await getKeyPair(walletStub)
    apiStub.nonce.returns({ result: 0 })
    apiStub.gasEstimate.returns({
      result: {
        GasFeeCap: '10',
        GasPremium: '10',
        GasLimit: 1000,
      },
    })

    const messageRequestWithCustomParams = {
      ...messageRequest,
      params: 'bugugugu',
    }
    const response = await signMessage(
      {
        snap: walletStub,
        // @ts-expect-error - test code
        rpc: apiStub,
        account,
        config: {
          ...Constants.testnetConfig,
        },
      },
      messageRequestWithCustomParams
    )

    expect(walletStub.rpcStubs.snap_dialog).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_getBip44Entropy).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledOnce()
    expect(apiStub.nonce).to.have.been.calledOnce()
    expect(apiStub.gasEstimate).to.have.been.calledOnce()

    expect(response).to.containSubset({
      error: null,
      result: {
        message: paramsMessage,
        signature: {
          type: 'SECP256K1',
          data: (expected: string) => typeof expected === 'string',
        },
      },
    })
  })

  it('should cancel signing on negative prompt', async function () {
    walletStub.rpcStubs.snap_dialog.resolves(false)
    walletStub.prepareFoKeyPair()
    const account = await getKeyPair(walletStub)

    apiStub.nonce.returns('0')
    const messageRequestWithGasParams = {
      ...messageRequest,
      gasFeeCap: '10',
      gasLimit: 1000,
      gasPremium: '10',
    }

    const response = await signMessage(
      {
        snap: walletStub,
        // @ts-expect-error - test code
        rpc: apiStub,
        account,
        config: {
          ...Constants.testnetConfig,
        },
      },
      messageRequestWithGasParams
    )

    expect(walletStub.rpcStubs.snap_dialog).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_getBip44Entropy).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledOnce()

    expect(response).to.containSubset({
      error: {
        message: 'User denied message signing',
      },
      result: null,
    })
  })

  it('should fail signing on invalid message ', async function () {
    walletStub.rpcStubs.snap_dialog.resolves(true)
    walletStub.prepareFoKeyPair()
    const account = await getKeyPair(walletStub)

    const invalidMessage = messageRequest
    invalidMessage.value = '-5000000000000000'

    apiStub.nonce.returns('0')

    const { error, result } = await signMessage(
      // @ts-expect-error - test code
      { snap: walletStub, rpc: apiStub, account },
      invalidMessage
    )

    expect(result).to.be.null()
    expect(error).to.not.be.null()
  })
})
