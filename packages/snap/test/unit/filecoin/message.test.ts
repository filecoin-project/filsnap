import { type MessageStatus } from '../../../src/types'
import { expect } from '../../utils'
import * as Constants from '../../../src/constants'
import { testAddress } from '../rpc/keyPairTestConstants'
import { mockSnapProvider } from '../wallet-mock'
import { updateMessageInState } from '../../../src/utils'

describe('Test saving transactions in state', function () {
  const walletStub = mockSnapProvider()

  const message = {
    cid: 'a1b2c3ee',
    message: {
      from: testAddress,
      gasFeeCap: '10',
      gasLimit: 1000,
      gasPremium: '10',
      method: 0,
      nonce: 1,
      to: testAddress,
      value: '100',
      params: '',
      version: 0,
    },
  } satisfies MessageStatus

  afterEach(function () {
    walletStub.reset()
  })

  it('should add transaction to state if empty state', async function () {
    walletStub.rpcStubs.snap_manageState
      .withArgs({ operation: 'get' })
      .resolves({ filecoin: { config: Constants.mainnetConfig, messages: [] } })

    walletStub.rpcStubs.snap_manageState
      .withArgs({
        newState: {
          filecoin: { config: Constants.mainnetConfig, messages: [message] },
        },
        operation: 'update',
      })
      .resolves()

    await updateMessageInState(walletStub, message)

    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledWithExactly(
      {
        newState: {
          filecoin: { config: Constants.mainnetConfig, messages: [message] },
        },
        operation: 'update',
      }
    )
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledTwice()
  })

  it('should add transaction to state if same hash transaction is not saved', async function () {
    const differentTx = { ...message, cid: 'abc123' }

    walletStub.rpcStubs.snap_manageState
      .withArgs({ operation: 'get' })
      .resolves({
        filecoin: { config: Constants.mainnetConfig, messages: [differentTx] },
      })

    walletStub.rpcStubs.snap_manageState
      .withArgs({
        newState: {
          filecoin: {
            config: Constants.mainnetConfig,
            messages: [differentTx, message],
          },
        },
        operation: 'update',
      })
      .resolves()

    await updateMessageInState(walletStub, message)

    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledWithExactly(
      {
        newState: {
          filecoin: {
            config: Constants.mainnetConfig,
            messages: [differentTx, message],
          },
        },
        operation: 'update',
      }
    )
  })

  it('should update transaction if same hash transaction already in state', async function () {
    const updatedTx = { ...message }
    updatedTx.message.nonce = 2

    walletStub.rpcStubs.snap_manageState
      .withArgs({ operation: 'get' })
      .resolves({
        filecoin: { config: Constants.mainnetConfig, messages: [message] },
      })

    walletStub.rpcStubs.snap_manageState
      .withArgs({
        newState: {
          filecoin: { config: Constants.mainnetConfig, messages: [updatedTx] },
        },
        operation: 'update',
      })
      .resolves()

    await updateMessageInState(walletStub, updatedTx)

    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledTwice()
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.calledWithExactly(
      {
        newState: {
          filecoin: { config: Constants.mainnetConfig, messages: [updatedTx] },
        },
        operation: 'update',
      }
    )
  })
})
