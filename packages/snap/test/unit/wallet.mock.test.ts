import { type SnapsGlobalObject } from '@metamask/snaps-types'
import sinon from 'sinon'
import { testBip44Entropy } from './rpc/keyPairTestConstants.js'
import * as Constants from '../../src/constants.js'

class WalletMock implements SnapsGlobalObject {
  public readonly registerRpcMessageHandler = sinon.stub()

  public readonly requestStub = sinon.stub()

  public readonly rpcStubs = {
    snap_dialog: sinon.stub(),
    snap_getBip44Entropy: sinon.stub(),
    snap_manageState: sinon.stub(),
    web3_clientVersion: sinon.stub(),
  }

  /**
   * Calls this.requestStub or this.rpcStubs[req.method], if the method has
   * a dedicated stub.
   *
   * @param args - stub arguments
   */
  // @ts-expect-error - test code
  public async request(
    args: Parameters<SnapsGlobalObject['request']>[0]
  ): Promise<ReturnType<SnapsGlobalObject['request']>> {
    const { method, params = [] } = args
    if (Object.hasOwnProperty.call(this.rpcStubs, method)) {
      return (this.rpcStubs as any)[method](
        ...(Array.isArray(params) ? params : [params])
      )
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.requestStub(args)
  }

  public reset(): void {
    this.registerRpcMessageHandler.reset()
    this.requestStub.reset()
    this.rpcStubs.snap_dialog.reset()
    this.rpcStubs.snap_getBip44Entropy.reset()
    this.rpcStubs.snap_manageState.reset()
    this.rpcStubs.web3_clientVersion.reset()
  }

  public prepareFoKeyPair(): void {
    this.rpcStubs.snap_manageState.withArgs({ operation: 'get' }).resolves({
      filecoin: {
        config: {
          ...Constants.mainnetConfig,
        },
        messages: [],
      },
    })
    this.rpcStubs.snap_getBip44Entropy.resolves(testBip44Entropy)
  }
}

// risky hack but it's hard to stub all provider methods
export function mockSnapProvider(): SnapsGlobalObject & WalletMock {
  const mock = new WalletMock()
  return mock as any as SnapsGlobalObject & WalletMock
}
