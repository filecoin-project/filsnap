import {
  Box,
  Heading,
  Section,
  type SnapComponent,
  type StringElement,
} from '@metamask/snaps-sdk/jsx'

type HeaderProps = {
  direction?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  alignment?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
  children: StringElement
}

export const Header: SnapComponent<HeaderProps> = ({
  children,
  direction = 'horizontal',
  size = 'md',
  alignment = 'center',
}) => {
  return (
    <Section>
      <Box direction={direction} alignment={alignment}>
        <Heading size={size}>{children}</Heading>
      </Box>
    </Section>
  )
}
