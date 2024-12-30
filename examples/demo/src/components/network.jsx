import { useFilsnap } from 'filsnap-adapter-react'
/**
 * Connect to the network.
 */
export default function Connect() {
  const { configure, config, isPending } = useFilsnap()

  return (
    <div class="Cell100 Box" style="overflow: hidden">
      <h3>Network</h3>
      <select
        name="network"
        id="network"
        disabled={isPending}
        onChange={(event) => {
          const network = /** @type {import('iso-filecoin/types').Network} */ (
            event?.currentTarget.value
          )
          configure({
            config: { network },
          })
        }}
        class="u-FullWidth"
      >
        <option value="testnet" selected={config.network === 'testnet'}>
          Testnet
        </option>
        <option value="mainnet" selected={config.network === 'mainnet'}>
          Mainnet
        </option>
      </select>
    </div>
  )
}
