/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { useFilsnapContext } from '../hooks/filsnap.js'

export default function Connect() {
  const { isLoading, connect, account } = useFilsnapContext()

  return (
    <div class="Cell25 Box">
      <h3>Network</h3>
      <select
        name="network"
        id="network"
        disabled={isLoading}
        onChange={(event) => {
          // @ts-ignore
          connect({ network: event?.currentTarget.value })
        }}
      >
        <option
          value="testnet"
          selected={account?.config.network === 'testnet'}
        >
          Testnet
        </option>
        <option
          value="mainnet"
          selected={account?.config.network === 'mainnet'}
        >
          Mainnet
        </option>
      </select>
    </div>
  )
}
