/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable unicorn/no-useless-undefined */
import { useEffect, useState } from 'preact/hooks'
import { useFilsnapContext } from '../hooks/filsnap.js'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Token } from 'iso-filecoin/token'

interface Inputs {
  recipient: string
  amount: string
}

/**
 * Send fil to an address
 */
function Send() {
  const { isLoading, snap, account } = useFilsnapContext()
  const [isEstimating, setIsEstimating] = useState<boolean>(false)
  const [isSending, setIsSending] = useState<boolean>(false)
  const [estimate, setEstimate] = useState<string>()
  const [total, setTotal] = useState<string>()
  const [error, setError] = useState<string>()
  const [result, setResult] = useState<string>()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<Inputs>()

  useEffect(() => {
    const { unsubscribe } = watch(async (data) => {
      if (snap == null) return
      const { recipient, amount } = data
      if (amount != null && recipient != null) {
        setIsEstimating(true)
        const value = Token.fromFIL(amount).toAttoFIL().toString()
        const estimate = await snap.calculateGasForMessage({
          message: {
            to: recipient,
            value,
          },
        })

        if (estimate.error != null) {
          setIsEstimating(false)
          setError(estimate.error?.message)
          return
        }

        const gas = Token.fromAttoFIL(estimate.result?.gasPremium ?? '0').mul(
          estimate.result?.gasLimit ?? '0'
        )

        const total = Token.fromFIL(amount).add(gas)
        setEstimate(gas.toFIL().toFormat(10))
        setTotal(total.toFIL().toFormat(10))
        setIsEstimating(false)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [watch, snap])

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (snap != null) {
      const { recipient, amount } = data

      setIsSending(true)
      const value = Token.fromFIL(amount).toAttoFIL().toString()
      const signedMessage = await snap.signMessage({
        to: recipient,
        value,
      })

      if (signedMessage.error != null) {
        setIsSending(false)
        setError(signedMessage.error?.message)
        return
      }

      const send = await snap.sendMessage(signedMessage.result)

      if (send.error != null) {
        setError(send.error?.message)
        setIsSending(false)
        return
      }
      setIsSending(false)
      setResult(send.result.cid)
      setEstimate(undefined)
      reset()
    }
  }

  return (
    <div class="Box Cell100">
      <h3>Send ⨎ </h3>
      {error != null && <code data-testid="error">{error}</code>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label for="recipient" id="recipient">
          Recipient
        </label>
        <input
          style={{ width: '100%' }}
          disabled={isLoading || isSending}
          {...register('recipient', { required: true })}
        />
        {errors.recipient != null && (
          <div>
            <small>This field is required</small>
          </div>
        )}
        <label for="amount" id="amount">
          Amount
        </label>
        <input
          disabled={isLoading || isSending}
          {...register('amount', { required: true })}
        />
        {errors.amount != null && (
          <div>
            <small>This field is required</small>
          </div>
        )}

        <button
          type="submit"
          data-testid="send-tx"
          disabled={isLoading || isSending}
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
      {result != null && (
        <small>
          {' '}
          Tx:{' '}
          <a
            target="_blank"
            rel="noreferrer"
            title="View on Glif explorer"
            href={`https://explorer.glif.io/tx/${result}/?network=${
              account?.config.network === 'mainnet'
                ? 'mainnet'
                : 'calibrationnet'
            }`}
          >
            {result}
          </a>
        </small>
      )}
      {isEstimating ? (
        <small>Estimating...</small>
      ) : estimate ? (
        <>
          <small>Gas (estimate): {estimate} FIL</small>
          <br />
          <small>Total (amount + gas): {total} FIL</small>
        </>
      ) : null}
    </div>
  )
}

export default Send
