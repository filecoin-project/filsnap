import { Address, Box, Link, Row } from '@metamask/snaps-sdk/jsx'
import { fromEthAddress } from 'iso-filecoin/address'
import { RPC } from 'iso-filecoin/rpc'
import { ListHeader } from '../components/header.tsx'
import * as Icons from '../svg/index.tsx'
import type { SignatureInsightsHandler } from '../types.ts'
import { addressToCaip10, explorerAddressLink } from '../utils.ts'

/**
 * Handles the base signature insights.
 *
 * @param props - The props passed to the handler.
 * @param config - The configuration object.
 * @returns A promise that resolves to an object containing the content to display.
 */
export const handleBaseSignature: SignatureInsightsHandler = async (
  props,
  config
) => {
  const { signature } = props

  if (config == null) {
    return null
  }

  const address = fromEthAddress(signature.from, config.network)
  const rpc = new RPC({
    api: config.rpc.url,
    network: config.network,
  })
  const idAddress = await address.toIdAddress({ rpc })
  return {
    content: (
      <Box>
        <ListHeader icon={Icons.settings} tooltip="Filecoin details">
          Details
        </ListHeader>
        <Row label="Signer" tooltip="Signer's address in robust format">
          <Link href={explorerAddressLink(address.toString(), config.network)}>
            <Address address={addressToCaip10(address.toString())} />
          </Link>
        </Row>
        <Row label="Signer ID" tooltip="Signer's in short format">
          <Link
            href={explorerAddressLink(idAddress.toString(), config.network)}
          >
            <Address address={addressToCaip10(idAddress.toString())} />
          </Link>
        </Row>
      </Box>
    ),
  }
}
