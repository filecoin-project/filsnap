import { useState } from 'preact/hooks'

// @ts-ignore-next-line
const Account = ({ api }) => {
  const [error, setError] = useState(/** @type {Error | undefined} */ (undefined))
  const [address, setAddress] = useState(/** @type {Error | undefined} */ (undefined))
  const [balance, setBalance] = useState(/** @type {Error | undefined} */ (undefined))
  const [publicKey, setPublicKey] = useState(/** @type {Error | undefined} */ (undefined))
  const [privateKey, setPrivateKey] = useState(/** @type {Error | undefined} */ (undefined))

  const handleGetAddress = async () => {
    try {
      const addressResponse = await api.getAddress()
      setAddress(addressResponse?.result)
    } catch (err) {
      // @ts-ignore
      setError(err)
    }
  }

  const handleGetBalance = async () => {
    try {
      const balanceResponse = await api.getBalance()
      setBalance(balanceResponse?.result)
    } catch (err) {
      // @ts-ignore
      setError(err)
    }
  }

  const handleGetPublicKey = async () => {
    try {
      const publicKeyResponse = await api.getPublicKey()
      setPublicKey(publicKeyResponse?.result)
    } catch (err) {
      // @ts-ignore
      setError(err)
    }
  }

  const handleExportPrivateKey = async () => {
    try {
      const privateKeyResponse = await api.exportPrivateKey()
      setPrivateKey(privateKeyResponse?.result)
    } catch (err) {
      // @ts-ignore
      setError(err)
    }
  }

  return (
    <>
      <h3>Account Details</h3>
      {/* Get Address */}
      <div class="Grid Space-below">
        <div class="Box">
          <span class="Box-text">
            <button data-testid="get-address" onClick={handleGetAddress}>
              Get Address
            </button>
          </span>
        </div>
        <div class="Box">
          <span class="Box-text">
            <code data-testid="error">{error ? error.message : ''}</code>
          </span>
        </div>
        <div class="Box">
          <span class="Box-text">
            <code data-testid="output">{address}</code>
          </span>
        </div>
      </div>

      {/* Get Balance */}
      <div class="Grid Space-below">
        <div class="Box">
          <span class="Box-text">
            <button data-testid="get-balance" onClick={handleGetBalance}>
              Get Balance
            </button>
          </span>
        </div>
        <div class="Box">
          <span class="Box-text">
            <code data-testid="error">{error ? error.message : ''}</code>
          </span>
        </div>
        <div class="Box">
          <span class="Box-text">
            <code data-testid="output">{balance}</code>
          </span>
        </div>
      </div>

      {/* Get Public Key */}
      <div class="Grid Space-below">
        <div class="Box">
          <span class="Box-text">
            <button data-testid="get-public-key" onClick={handleGetPublicKey}>
              Get Public Key
            </button>
          </span>
        </div>
        <div class="Box">
          <span class="Box-text">
            <code data-testid="error">{error ? error.message : ''}</code>
          </span>
        </div>
        <div class="Box">
          <span class="Box-text">
            <code data-testid="output">{publicKey}</code>
          </span>
        </div>
      </div>

      {/* Export Private Key */}
      <div class="Grid Space-below">
        <div class="Box">
          <span class="Box-text">
            <button
              data-testid="get-public-key"
              onClick={handleExportPrivateKey}
            >
              Export Private Key
            </button>
          </span>
        </div>
        <div class="Box">
          <span class="Box-text">
            <code data-testid="error">{error ? error.message : ''}</code>
          </span>
        </div>
        <div class="Box">
          <span class="Box-text">
            <code data-testid="output">{privateKey}</code>
          </span>
        </div>
      </div>
    </>
  )
}

export default Account
