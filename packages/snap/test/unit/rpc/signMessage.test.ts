import { expect } from '../../utils'
import { signMessage } from '../../../src/rpc/signMessage'
import type { Message, MessageRequest } from '../../../src/types'
import { LotusApiMock } from '../lotusapi-mock'
import { mockSnapProvider } from '../wallet-mock'

describe('Test rpc handler function: signMessage', function () {
  const walletStub = mockSnapProvider()
  const apiStub = new LotusApiMock()

  const messageRequest: MessageRequest = {
    to: 't12flyjpedjjqlrr2dmlnrtbh62qav3b3h7o7lohy',
    value: '5000000000000000',
  }

  const fullMessage: Message = {
    ...messageRequest,
    from: 'f1ekszptik2ognlx24xz7zubejtw3cyidv4t4ibyy',
    gasfeecap: '10',
    gaslimit: 1000,
    gaspremium: '10',
    method: 0,
    nonce: 0,
    params: '',
  }

  const paramsMessage: Message = {
    ...messageRequest,
    from: 'f1ekszptik2ognlx24xz7zubejtw3cyidv4t4ibyy',
    gasfeecap: '10',
    gaslimit: 1000,
    gaspremium: '10',
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

    apiStub.mpoolGetNonce.returns('0')
    apiStub.gasEstimateMessageGas.returns({
      GasPremium: '10',
      GasFeeCap: '10',
      GasLimit: 1000,
    })

    const response = await signMessage(walletStub, apiStub, messageRequest)

    expect(walletStub.rpcStubs.snap_dialog).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_getBip44Entropy).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledOnce()
    expect(apiStub.mpoolGetNonce).to.have.been.calledOnce()
    expect(apiStub.gasEstimateMessageGas).to.have.been.calledOnce()

    expect(response).to.containSubset({
      confirmed: true,
      error: undefined,
      signedMessage: {
        message: fullMessage,
        signature: {
          type: 1,
          data: (expected: string) => typeof expected === 'string',
        },
      },
    })
  })

  it('should successfully sign valid message with gas params on positive prompt', async function () {
    walletStub.rpcStubs.snap_dialog.resolves(true)
    walletStub.prepareFoKeyPair()

    apiStub.mpoolGetNonce.returns('0')

    const messageRequestWithGasParams: MessageRequest = {
      ...messageRequest,
      gasfeecap: '10',
      gaslimit: 1000,
      gaspremium: '10',
      nonce: 1,
    }
    const response = await signMessage(
      walletStub,
      apiStub,
      messageRequestWithGasParams
    )

    expect(walletStub.rpcStubs.snap_dialog).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_getBip44Entropy).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledOnce()
    expect(apiStub.mpoolGetNonce).to.have.not.been.called()

    expect(response).to.containSubset({
      confirmed: true,
      error: undefined,
      signedMessage: {
        message: {
          ...fullMessage,
          nonce: 1,
        },
        signature: {
          type: 1,
          data: (expected: string) => typeof expected === 'string',
        },
      },
    })
  })

  it('should successfully sign valid message with custom params on positive prompt', async function () {
    walletStub.rpcStubs.snap_dialog.resolves(true)
    walletStub.prepareFoKeyPair()
    apiStub.mpoolGetNonce.returns('0')
    apiStub.gasEstimateMessageGas.returns({
      GasFeeCap: '10',
      GasPremium: '10',
      GasLimit: 1000,
    })

    const messageRequestWithCustomParams: MessageRequest = {
      ...messageRequest,
      params: 'bugugugu',
    }
    const response = await signMessage(
      walletStub,
      apiStub,
      messageRequestWithCustomParams
    )

    expect(walletStub.rpcStubs.snap_dialog).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_getBip44Entropy).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledOnce()
    expect(apiStub.mpoolGetNonce).to.have.been.calledOnce()
    expect(apiStub.gasEstimateMessageGas).to.have.been.calledOnce()

    expect(response).to.containSubset({
      confirmed: true,
      error: undefined,
      signedMessage: {
        message: paramsMessage,
        signature: {
          type: 1,
          data: (expected: string) => typeof expected === 'string',
        },
      },
    })
  })

  it('should cancel signing on negative prompt', async function () {
    walletStub.rpcStubs.snap_dialog.resolves(false)
    walletStub.prepareFoKeyPair()

    apiStub.mpoolGetNonce.returns('0')
    const messageRequestWithGasParams: MessageRequest = {
      ...messageRequest,
      gasfeecap: '10',
      gaslimit: 1000,
      gaspremium: '10',
    }

    const response = await signMessage(
      walletStub,
      apiStub,
      messageRequestWithGasParams
    )

    expect(walletStub.rpcStubs.snap_dialog).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_getBip44Entropy).to.have.been.calledOnce()
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledOnce()

    expect(response).to.containSubset({
      confirmed: false,
      error: (expected: Error) => expected instanceof Error,
      signedMessage: undefined,
    })
  })

  it('should fail signing on invalid message ', async function () {
    walletStub.rpcStubs.snap_dialog.resolves(true)
    walletStub.prepareFoKeyPair()

    const invalidMessage = messageRequest
    invalidMessage.value = '-5000000000000000'

    apiStub.mpoolGetNonce.returns('0')

    const response = await signMessage(walletStub, apiStub, invalidMessage)

    expect(response.result).to.be.undefined()
    expect(response.error).to.not.be.null()
    expect(response.confirmed).to.be.false()
  })
})
