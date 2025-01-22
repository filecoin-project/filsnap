import {
  Button,
  Icon,
  type IconProps,
  type SnapComponent,
  type StringElement,
} from '@metamask/snaps-sdk/jsx'

type ButtonIconProps = {
  name: string
  icon: IconProps['name']
  children: StringElement
  color?: 'primary' | 'default' | 'muted'
  type?: 'submit' | 'button'
}

export const ButtonIcon: SnapComponent<ButtonIconProps> = ({
  children,
  name,
  icon,
  color = 'muted',
  type = 'button',
}) => {
  return (
    <Button type={type} name={name}>
      <Icon name={icon} size="md" color={color} /> &nbsp; {children}
    </Button>
  )
}
