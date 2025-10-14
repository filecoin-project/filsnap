import {
  Button,
  type SnapComponent,
  type StringElement,
} from '@metamask/snaps-sdk/jsx'
import { type IconColors, SvgIcon } from './svg-icon.tsx'

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
    <Button name={name} type={type}>
      <SvgIcon
        alt={children?.toString()}
        color={iconColor}
        icon={icon}
        inline
        size={iconSize}
      />
      &nbsp; {children}
    </Button>
  )
}
