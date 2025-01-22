import {
  Box,
  type GenericSnapElement,
  Section,
  type SnapComponent,
  type SnapsChildren,
} from '@metamask/snaps-sdk/jsx'

type FooterProps = {
  direction?: 'horizontal' | 'vertical'
  alignment?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
  children: SnapsChildren<GenericSnapElement>
}

export const Footer: SnapComponent<FooterProps> = ({
  children,
  direction = 'horizontal',
  alignment = 'space-around',
}) => {
  return (
    <Section>
      <Box direction={direction} alignment={alignment}>
        {children}
      </Box>
    </Section>
  )
}
