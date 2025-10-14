import { Box, type SnapComponent, Text, Tooltip } from '@metamask/snaps-sdk/jsx'
import iconFilecoin from '../svg/filecoin-logo.svg'
import type { SnapConfig } from '../types.ts'
import { formatFIL } from '../utils.ts'
import { SvgIcon } from './svg-icon.tsx'

type HomePageProps = {
  balance: string
  config: SnapConfig
}

export const Balance: SnapComponent<HomePageProps> = ({ balance, config }) => {
  return (
    <Box direction="horizontal">
      <SvgIcon alt="Filecoin" icon={iconFilecoin} />
      <Tooltip content={<Text>{formatFIL(balance, config)}</Text>}>
        <Text>
          {formatFIL(balance, {
            ...config,
            unit: { decimals: 4, symbol: config.unit?.symbol ?? 'FIL' },
          })}
        </Text>
      </Tooltip>
    </Box>
  )
}
