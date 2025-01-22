import { Image, type SnapComponent } from '@metamask/snaps-sdk/jsx'

type HomePageProps = {
  width?: number
  height?: number
  icon: string
  alt?: string
}

export const SvgIcon: SnapComponent<HomePageProps> = ({
  width = 16,
  height = 16,
  alt = 'Icon svg',
  icon,
}) => {
  icon = icon.replace(/width="(\d+)"/, `width="${width}"`)
  icon = icon.replace(/height="(\d+)"/, `height="${height}"`)
  return <Image src={icon} alt={alt} />
}
