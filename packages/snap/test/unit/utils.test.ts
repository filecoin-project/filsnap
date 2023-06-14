import { parseDerivationPath } from '../../src/utils.js'
import { expect } from '../utils.js'

describe('Utils', function () {
  it('should parse testnet bip44 derivation path', async function () {
    const components = parseDerivationPath("m/44'/1'/0'/0/0")

    expect(components).to.be.deep.equal({
      purpose: 44,
      coinType: 1,
      account: 0,
      change: 0,
      addressIndex: 0,
    })
  })

  it('should parse mainnet bip44 derivation path', async function () {
    const components = parseDerivationPath("m/44'/461'/0'/0/0")

    expect(components).to.be.deep.equal({
      purpose: 44,
      coinType: 461,
      account: 0,
      change: 0,
      addressIndex: 0,
    })
  })

  it('should fail parse short bip44 derivation path', async function () {
    expect(() => parseDerivationPath("m/44'/461'/0'/0")).to.throw(
      "Invalid derivation path: depth must be 5 \"m / purpose' / coin_type' / account' / change / address_index\""
    )
  })

  it('should fail parse bip44 derivation path without m', async function () {
    expect(() => parseDerivationPath("/44'/461'/0'/0/0")).to.throw(
      'Invalid derivation path: depth 0 must be "m"'
    )
  })

  it("should fail parse bip44 derivation path with part 1 != 44'", async function () {
    expect(() => parseDerivationPath("m/j4'/461'/0'/0/0")).to.throw(
      'Invalid derivation path: The "purpose" node (depth 1) must be the string "44\'"'
    )
  })
})
