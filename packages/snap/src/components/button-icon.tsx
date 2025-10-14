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
    <Button name={name} type={type}>
      <Icon color={color} name={icon} size="md" /> &nbsp; {children}
    </Button>
  )
}
