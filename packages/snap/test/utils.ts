import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import chaiParentheses from 'chai-parentheses'
import chaiSubset from 'chai-subset'
import sinonChai from 'sinon-chai'

chai.use(chaiAsPromised)
chai.use(chaiParentheses)
chai.use(chaiSubset)
chai.use(sinonChai)

export const expect = chai.expect
export const assert = chai.assert
