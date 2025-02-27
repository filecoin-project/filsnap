import { useFilsnap } from 'filsnap-adapter-react'
import { utf8 } from 'iso-base/utf8'
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

  /** @type {import('preact').JSX.SubmitEventHandler<HTMLFormElement>} */
  async function handleSubmit(event) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    const response = await snap?.sign(
      utf8.decode(data.get('messageToSign')?.toString() || '')
    )
    if (response) {
      setSignature(response?.result?.toLotusHex())
      setError(response.error?.message)
    }
  }

  return (
    <div class="Box Cell100">
      <h3>Signature</h3>
      {error && <code data-testid="error">{error}</code>}
      <form method="post" onSubmit={handleSubmit}>
        <label for="messageToSign" class="u-FullWidth">
          Message to sign:
        </label>
        <input name="messageToSign" class="u-FullWidth" />
        <button type="submit" data-testid="get-public-key" disabled={isLoading}>
          Sign Message
        </button>
      </form>
      <textarea data-testid="output" class="u-FullWidth">
        {signature}
      </textarea>
    </div>
  )
}

export default SignMessage
