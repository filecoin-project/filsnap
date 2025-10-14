import { Box, Copyable, Divider, Row, Text } from '@metamask/snaps-sdk/jsx'
import { hex } from 'iso-base/rfc4648'
import { decodeSignaturePayload, isDelegationPayload } from 'iso-ucan/envelope'
import { ListHeader } from '../components/header.tsx'
import * as Icons from '../svg/index.tsx'
import type { SignatureInsightsHandler } from '../types.ts'
import { serializeObject } from '../utils.ts'

/**
 * Handles the Ucan signature insights.
 *
 * @param props - The props passed to the handler.
 * @param config - The configuration object.
 * @returns A promise that resolves to an object containing the content to display.
 */
export const handleUcanSignature: SignatureInsightsHandler = (
  props,
  _config
) => {
  const { signature } = props

  if (signature.signatureMethod !== 'personal_sign') {
    return null
  }

  const bytes = hex.decode(signature.data.slice(2))
  try {
    const decoded = decodeSignaturePayload(bytes)
    const payload = decoded.payload

    if (decoded.alg !== 'EIP191') {
      return null
    }

    let title = ''
    if (isDelegationPayload(decoded.payload)) {
      title = 'Delegation'
    } else {
      title = 'Invocation'
    }

    // console.log('🚀 ~ handleUcanSignature ~ payload:', decoded.payload.nbf)

    return {
      content: (
        <Box>
          <ListHeader
            icon={Icons.wallet}
            subtitle="Ucan signature request"
            tooltip="Ucan signature request"
          >
            UCAN {title} Signature
          </ListHeader>
          <Row label="Issuer" tooltip="Issuer's DID">
            <Text color="alternative" size="sm">
              {truncateMiddle(payload.iss, 18, 6)}
            </Text>
          </Row>
          {payload.aud != null && (
            <Row label="Audience" tooltip="Audience's DID">
              <Text color="alternative" size="sm">
                {truncateMiddle(payload.aud, 18, 6)}
              </Text>
            </Row>
          )}
          <Row label="Subject" tooltip="Subject's DID">
            <Text color="alternative" size="sm">
              {payload.sub ? truncateMiddle(payload.sub, 18, 6) : 'null'}
            </Text>
          </Row>
          <Row label="Command" tooltip="Command">
            <Text color="alternative" size="sm">
              {payload.cmd}
            </Text>
          </Row>
          {payload.exp != null && (
            <Row label="Expires at" tooltip="Expires at">
              <Text color="alternative" size="sm">
                {new Date(payload.exp * 1000).toLocaleString()}
              </Text>
            </Row>
          )}
          {payload.nbf != null && (
            <Row label="Valid from" tooltip="Valid from">
              <Text color="alternative" size="sm">
                {new Date(payload.nbf * 1000).toLocaleString()}
              </Text>
            </Row>
          )}
          {/* {payload.meta && (
          <Row label="Meta" tooltip="Meta">
            <Text color="alternative">{JSON.stringify(payload.meta)}</Text>
          </Row>
        )} */}

          <Divider />
          <ListHeader icon={Icons.eye} tooltip="Raw payload">
            Raw Payload
          </ListHeader>
          <Copyable value={JSON.stringify(serializeObject(payload), null, 2)} />
        </Box>
      ),
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

/**
 * Truncates a string by keeping a specified number of characters at the start and end,
 * replacing the middle with "...". If the string is too short, returns it as is.
 *
 * @param str - The string to truncate.
 * @param startLen - Number of characters to keep at the start.
 * @param endLen - Number of characters to keep at the end.
 * @returns The truncated string.
 * @example
 * ```ts twoslash
 * import { truncateMiddle } from 'filsnap/utils'
 * truncateMiddle('f1abcdef1234567890abcdef', 4, 4) // "f1ab...cdef"
 * ```
 */
export function truncateMiddle(
  str: string,
  startLen: number,
  endLen: number
): string {
  if (str.length <= startLen + endLen + 3) return str
  return `${str.slice(0, startLen)}...${str.slice(-endLen)}`
}
