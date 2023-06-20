import assert from 'assert'
import { MessageSchema } from '../src/message.js'

describe('message validation', function () {
  it(`should validate`, async function () {
    const valid = MessageSchema.safeParse({
      version: 0,
      to: 't1pc2apytmdas3sn5ylwhfa32jfpx7ez7ykieelna',
      from: 't1pc2apytmdas3sn5ylwhfa32jfpx7ez7ykieelna',
      nonce: 0,
      value: '1000000000000000000',
      gasLimit: 1_000_000,
      gasFeeCap: '1000000000000000000',
      gasPremium: '1000000000000000000',
      method: 0,
      params: '',
    })

    assert.ok(valid.success)
  })

  it(`should validate from partial`, async function () {
    const valid = MessageSchema.safeParse({
      to: 't1pc2apytmdas3sn5ylwhfa32jfpx7ez7ykieelna',
      from: 't1pc2apytmdas3sn5ylwhfa32jfpx7ez7ykieelna',
      value: '1000000000000000000',
    })

    assert.ok(valid.success)

    assert.deepEqual(valid.data, {
      version: 0,
      to: 't1pc2apytmdas3sn5ylwhfa32jfpx7ez7ykieelna',
      from: 't1pc2apytmdas3sn5ylwhfa32jfpx7ez7ykieelna',
      nonce: 0,
      value: '1000000000000000000',
      gasLimit: 0,
      gasFeeCap: '0',
      gasPremium: '0',
      method: 0,
      // eslint-disable-next-line unicorn/no-null
      params: '',
    })
  })
})
