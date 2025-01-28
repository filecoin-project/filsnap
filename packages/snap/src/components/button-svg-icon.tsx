import {
  Button,
  type SnapComponent,
  type StringElement,
} from '@metamask/snaps-sdk/jsx'
import { type IconColors, SvgIcon } from './svg-icon'

type ButtonSvgIconProps = {
  name: string
  icon: string
  iconColor?: IconColors
  iconSize?: number
  children: StringElement
  type?: 'submit' | 'button'
}

export const ButtonSvgIcon: SnapComponent<ButtonSvgIconProps> = ({
  children,
  name,
  icon,
  iconColor = 'alternative',
  iconSize = 20,
  type = 'button',
}) => {
  return (
    <Button type={type} name={name}>
      <SvgIcon
        icon={icon}
        color={iconColor}
        size={iconSize}
        alt={children?.toString()}
        inline
      />
      &nbsp; {children}
    </Button>
  )
}
