import { useState } from 'preact/hooks'

// @ts-ignore-next-line
const SignMessage = ({ api }) => {
  const [textFieldValue, setTextFieldValue] = useState(
    /** @type {string | undefined} */ undefined
  )
  const [signature, setSignature] = useState(
    /** @type {string | undefined} */ (undefined)
  )
  const [error, setError] = useState(
    /** @type {Error | undefined} */ (undefined)
  )

  const toHex = (str) => {
    var result = ''
    for (var i = 0; i < str.length; i++) {
      result += str.charCodeAt(i).toString(16)
    }
    return `0x${result}`
  }

  const handleChange = (event) => {
    console.log('event.target.value', event.target.value)
    setTextFieldValue(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (textFieldValue) {
        const rawMessage = toHex(textFieldValue)
        const sigResponse = await api.signMessageRaw(rawMessage)
        setSignature(sigResponse.result)
      }
    } catch (err) {
      // @ts-ignore
      setError(err)
      console.error(err)
    }
  }

  return (
    <>
      <h3>Signature Testing</h3>
      <div class="Grid Space-below">
        <div class="Box">
          <span class="Box-text">
            <form method="post" onSubmit={handleSubmit}>
              <label>
                Message to sign:{' '}
                <input class="Input" name="messageToSign" onChange={handleChange} />
              </label>
              <button type="submit" data-testid="get-public-key">
                Sign Message
              </button>
            </form>
          </span>
        </div>
        <div class="Box">
          <span class="Box-text">
            <code data-testid="error">{error ? error.message : ''}</code>
          </span>
        </div>
        <div class="Box">
          <span class="Box-text">
            <code data-testid="output">{signature}</code>
          </span>
        </div>
      </div>
    </>
  )
}

export default SignMessage
