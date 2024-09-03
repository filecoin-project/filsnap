import { filForwarderMetadata } from 'filsnap-adapter'
import { useFilsnap } from 'filsnap-adapter-react'
import * as Address from 'iso-filecoin/address'
import { Token } from 'iso-filecoin/token'
import type { JSX } from 'preact'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useWriteContract } from 'wagmi'

interface Inputs {
  recipient: string
  amount: string
}

/**
 * Send fil to an address
 */
function Forward(): JSX.Element {
  const { account, isPending: isSnapPending } = useFilsnap()
  const {
    data,
    isPending: isConstractPending,
    writeContract,
    error,
  } = useWriteContract()

  const isPending = isConstractPending || isSnapPending

  if (error) {
    toast.error(error.message, { autoClose: false })
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (writeContract != null) {
      const { recipient, amount } = data
      writeContract({
        address: filForwarderMetadata.contractAddress,
        abi: filForwarderMetadata.abi,
        functionName: 'forward',
        value: Token.fromFIL(amount).toBigInt(),
        args: [Address.from(recipient).toContractDestination()],
      })
      reset()
    }
  }

  return (
    <div class="Box Cell100">
      <h3>Forward ⨎ </h3>
      <form
        /*
      // @ts-expect-error - preact */
        onSubmit={handleSubmit(onSubmit)}
      >
        <label for="recipient" id="recipient">
          Recipient
        </label>
        <input
          style={{ width: '100%' }}
          disabled={isPending}
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
          disabled={isPending}
          placeholder="FIL"
          {...register('amount', { required: true })}
        />
        {errors.amount != null && (
          <div>
            <small>This field is required</small>
          </div>
        )}

        <button type="submit" data-testid="send-tx" disabled={isPending}>
          {isConstractPending ? 'Forwarding...' : 'Forward'}
        </button>
      </form>

      {data && (
        <small>
          {' '}
          Tx:{' '}
          <a
            target="_blank"
            rel="noreferrer"
            title="View on Glif explorer"
            href={`https://explorer.glif.io/tx/${data}/?network=${
              account?.config.network === 'mainnet'
                ? 'mainnet'
                : 'calibrationnet'
            }`}
          >
            {data}
          </a>
        </small>
      )}
    </div>
  )
}

export default Forward
