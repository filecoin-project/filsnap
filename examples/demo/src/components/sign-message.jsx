import { useFilsnap } from 'filsnap-adapter-react'
/* eslint-disable unicorn/no-useless-undefined */
import { useState } from 'preact/hooks'

// @ts-ignore-next-line
const SignMessage = () => {
  const { isLoading, snap } = useFilsnap()
  const [signature, setSignature] = useState(
    /** @type {string | undefined | null} */ (undefined)
  )
  const [error, setError] = useState(
    /** @type {string | undefined } */ (undefined)
  )

  /** @type {import('preact/src/jsx.js').JSXInternal.GenericEventHandler<HTMLFormElement>} */
  async function handleSubmit(event) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    const response = await snap?.signMessageRaw({
      message: data.get('messageToSign') || '',
    })
    if (response) {
      setSignature(response?.result)
      setError(response.error?.message)
    }
  }

  return (
    <div class="Box Cell100">
      <h3>Signature</h3>
      {error && <code data-testid="error">{error}</code>}
      <form method="post" onSubmit={handleSubmit}>
        <label>
          Message to sign: <input name="messageToSign" />
          <button
            type="submit"
            data-testid="get-public-key"
            disabled={isLoading}
          >
            Sign Message
          </button>
        </label>
      </form>
      <code data-testid="output">{signature}</code>
    </div>
  )
}

export default SignMessage
