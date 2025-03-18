import * as Address from 'iso-filecoin/address'
import { filForwarderMetadata } from 'iso-filecoin/contracts/filforwarder.js'
import { Token } from 'iso-filecoin/token'
import {
  useAccount,
  useBalance,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useWriteContract,
} from 'wagmi'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName ?? undefined })

  const { data: balance } = useBalance({ address })

  const {
    isPending: isConstractPending,
    writeContract,
    error,
  } = useWriteContract()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const recipient = formData.get('recipient') as string
    const amount = formData.get('amount') as string
    writeContract({
      address: filForwarderMetadata.contractAddress,
      abi: filForwarderMetadata.abi,
      functionName: 'forward',
      value: Token.fromFIL(amount).toBigInt(),
      args: [Address.from(recipient).toContractDestination()],
    })
  }

  return (
    <div>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
      <div>Balance: {balance?.value?.toString()}</div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="recipient">Recipient</label>
          <input
            name="recipient"
            style={{ width: '100%' }}
            placeholder="f0, f1, f2, f3, f4"
          />
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input placeholder="FIL" name="amount" type="number" />
        </div>
        <button type="submit" data-testid="send-tx">
          {isConstractPending ? 'Forwarding...' : 'Forward'}
        </button>
      </form>
      {error && <div>{error.message}</div>}
      <button type="button" onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  )
}
