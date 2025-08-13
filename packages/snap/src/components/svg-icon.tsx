import { Box, Image, type SnapComponent } from '@metamask/snaps-sdk/jsx'
import iconFilecoin from '../svg/filecoin-logo.svg'

export type IconColors =
  | 'default'
  | 'alternative'
  | 'muted'
  | 'error'
  | 'success'
  | 'warning'

type HomePageProps = {
  icon: string
  alt?: string
  color?: IconColors
  size?: number
  inline?: boolean
}

export const SvgIcon: SnapComponent<HomePageProps> = ({
  alt = 'Icon svg',
  icon,
  color = 'default',
  size = 16,
  inline = false,
}) => {
  let colorHex = '#44AEFC'
  switch (color) {
    case 'default':
      colorHex = '#44AEFC'
      break
    case 'alternative':
      colorHex = '#9EA6AE'
      break
    case 'muted':
      colorHex = '#6A737D'
      break
    case 'error':
      colorHex = '#E78F97'
      break
    case 'success':
      colorHex = '#28A745'
      break
    case 'warning':
      colorHex = '#FFDF70'
      break
    default:
      colorHex = '#44AEFC'
  }

  icon = icon.replace(/width="(\d+)"/, `width="${size}"`)
  icon = icon.replace(/height="(\d+)"/, `height="${size}"`)
  icon = icon.replace(/stroke="([^"]+)"/, `stroke="${colorHex}"`)

  if (inline) {
    return <Image src={icon} alt={alt} />
  }
  return (
    <Box direction="horizontal">
      <Image src={icon} alt={alt} />
    </Box>
  )
}

/**
 * primary: #44AEFC
 * red: #E78F97
 * green: #28A745
 * yellow: #FFDF70
 * muted: #6A737D
 * alternative: #9EA6AE
 */

type FilecoinIconProps = {
  size?: number
  inline?: boolean
}

/**
 * Filecoin Icon
 *
 * @param props - The props containing the icon, alt, color, size, and inline.
 * @returns The Filecoin icon.
 */
export const FilecoinIcon: SnapComponent<FilecoinIconProps> = ({
  size = 16,
  inline = false,
}) => {
  return (
    <SvgIcon icon={iconFilecoin} alt="Filecoin" size={size} inline={inline} />
  )
}
