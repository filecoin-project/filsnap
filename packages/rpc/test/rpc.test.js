import assert from 'assert'
import { RPC } from '../src/index.js'
import { Message } from '../src/message.js'

const API = 'https://api.calibration.node.glif.io'

describe('lotus rpc', function () {
  it(`version`, async function () {
    const rpc = new RPC({ api: API })

    const version = await rpc.version()
    if (version.error) {
      return assert.fail(version.error.message)
    }

    assert(version.result.Version)
    assert(version.result.APIVersion)
    assert(version.result.BlockDelay)
  })

  it(`networkName`, async function () {
    const rpc = new RPC({ api: API })

    const version = await rpc.networkName()
    if (version.error) {
      return assert.fail(version.error.message)
    }

    assert.equal(version.result, 'calibrationnet')
  })

  it(`nonce`, async function () {
    const rpc = new RPC({ api: API, network: 'testnet' })

    const version = await rpc.nonce('t1pc2apytmdas3sn5ylwhfa32jfpx7ez7ykieelna')
    if (version.error) {
      return assert.fail(version.error.message)
    }

    assert.ok(Number.isInteger(version.result))
  })

  it(`nonce fail with wrong network`, async function () {
    const rpc = new RPC({ api: API, network: 'testnet' })

    await assert.rejects(() =>
      rpc.nonce('f1jbnosztqwadgh4smvsnojdvwjgqxsmtzy5n5imi')
    )
  })

  it(`gas estimate`, async function () {
    const rpc = new RPC({ api: API, network: 'testnet' })

    const nonce = await rpc.nonce('t1pc2apytmdas3sn5ylwhfa32jfpx7ez7ykieelna')
    if (nonce.error) {
      return assert.fail(nonce.error.message)
    }

    const msg = new Message({
      from: 't1pc2apytmdas3sn5ylwhfa32jfpx7ez7ykieelna',
      to: 't1sfizuhpgjqyl4yjydlebncvecf3q2cmeeathzwi',
      nonce: nonce.result,
      value: '100000000000000000',
    })

    const estimate = await rpc.gasEstimate(msg)
    if (estimate.error) {
      return assert.fail(estimate.error.message)
    }

    assert.equal(Message.fromJSON(estimate.result).value, msg.value)
  })

  it(`balance`, async function () {
    const rpc = new RPC({ api: API, network: 'testnet' })

    const balance = await rpc.balance(
      't1pc2apytmdas3sn5ylwhfa32jfpx7ez7ykieelna'
    )
    if (balance.error) {
      return assert.fail(balance.error.message)
    }

    assert.ok(typeof balance.result === 'string')
  })
})
