import sinon from 'sinon'
import type { RPC } from 'iso-filecoin/rpc'
import type { Network } from 'iso-filecoin/types'

// @ts-expect-error - test code
export class LotusApiMock implements RPC {
  public version = sinon.stub()
  public balance = sinon.stub()
  public nonce = sinon.stub()
  public pushMessage = sinon.stub()
  public gasEstimate = sinon.stub()
  public networkName = sinon.stub()
  public fetch = globalThis.fetch
  public network: Network = 'mainnet'
  public api = new URL('http://localhost:1234/rpc/v0')
  public headers = {
    'Content-Type': 'application/json',
  }

  public reset(): void {
    this.version.reset()
    this.balance.reset()
    this.nonce.reset()
    this.pushMessage.reset()
    this.gasEstimate.reset()
    this.networkName.reset()
  }
}
