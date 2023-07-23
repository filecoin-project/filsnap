/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable unicorn/no-useless-undefined */
import * as Address from 'iso-filecoin/address'
import { Token } from 'iso-filecoin/token'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useContractWrite } from 'wagmi'
import { abi } from '../fil-forwarder.js'
import { useFilsnapContext } from '../hooks/filsnap.js'

interface Inputs {
  recipient: string
  amount: string
}

/**
 * Send fil to an address
 */
function Forward() {
  const { account } = useFilsnapContext()
  const { data, isLoading, isSuccess, error, write } = useContractWrite({
    address: '0x2B3ef6906429b580b7b2080de5CA893BC282c225',
    abi,
    functionName: 'forward',
    value: 0n,
  })
  // eslint-disable-next-line no-console
  console.log(
    '🚀 ~ file: connect-fevm.jsx:33 ~ ConnectFEVM ~ isLoading:',
    isLoading,
    isSuccess,
    error
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (write != null) {
      const { recipient, amount } = data
      write({
        value: Token.fromFIL(amount).toBigInt(),
        args: [Address.from(recipient).toContractDestination()],
      })
      reset()
    }
  }

  return (
    <div class="Box Cell100">
      <h3>Forward ⨎ </h3>
      {error != null && <code data-testid="error">{error.message}</code>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label for="recipient" id="recipient">
          Recipient
        </label>
        <input
          style={{ width: '100%' }}
          disabled={isLoading}
          placeholder="f0, f1, f2, f3, f4"
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
          disabled={isLoading}
          placeholder="FIL"
          {...register('amount', { required: true })}
        />
        {errors.amount != null && (
          <div>
            <small>This field is required</small>
          </div>
        )}

        <button type="submit" data-testid="send-tx" disabled={isLoading}>
          {isLoading ? 'Forwarding...' : 'Forward'}
        </button>
      </form>

      {isSuccess && data && (
        <small>
          {' '}
          Tx:{' '}
          <a
            target="_blank"
            rel="noreferrer"
            title="View on Glif explorer"
            href={`https://explorer.glif.io/tx/${data?.hash}/?network=${
              account?.config.network === 'mainnet'
                ? 'mainnet'
                : 'calibrationnet'
            }`}
          >
            {data?.hash}
          </a>
        </small>
      )}
    </div>
  )
}

export default Forward
