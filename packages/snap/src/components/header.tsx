import {
  Bold,
  Box,
  Heading,
  Section,
  type SnapComponent,
  type StringElement,
  Text,
  type TextChildren,
  Tooltip,
} from '@metamask/snaps-sdk/jsx'
import { type IconColors, SvgIcon } from './svg-icon.tsx'

type HeaderProps = {
  direction?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  alignment?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
  children: StringElement
  icon?: string
  iconColor?: IconColors
  iconSize?: number
  sub?: string
}

export const Header: SnapComponent<HeaderProps> = ({
  children,
  direction = 'horizontal',
  size = 'sm',
  alignment = 'start',
  icon,
  iconColor,
  iconSize = 54,
  sub,
}) => {
  return (
    <Section alignment={alignment} direction={direction}>
      {icon ? <SvgIcon color={iconColor} icon={icon} size={iconSize} /> : null}
      <Text color="alternative">&nbsp</Text>
      <Box alignment="center" direction="vertical">
        <Box direction="horizontal">
          <Heading size={size}>{children}</Heading>
        </Box>
        {sub ? (
          <Box direction="horizontal">
            <Text color="alternative">{sub}</Text>
          </Box>
        ) : null}
      </Box>
    </Section>
  )
}

type ListHeaderProps = {
  children: StringElement
  icon: string
  tooltip?: string
  subtitle?: string
}
export const ListHeader: SnapComponent<ListHeaderProps> = ({
  icon,
  tooltip,
  children,
  subtitle,
}) => {
  return (
    <Box direction="vertical">
      <Box direction="horizontal">
        <SvgIcon color="alternative" icon={icon} />
        {tooltip ? (
          <Tooltip content={tooltip}>
            <Text color="default">
              <Bold>{children}</Bold>
            </Text>
          </Tooltip>
        ) : (
          <Text color="default">
            <Bold>{children}</Bold>
          </Text>
        )}
      </Box>
      {subtitle ? (
        <Text color="muted" size="sm">
          {subtitle}
        </Text>
      ) : null}
    </Box>
  )
}

type ListHeaderProps2 = {
  children: StringElement
  icon: string
  tooltip?: string
  subtitle?: TextChildren
}
export const ListHeader2: SnapComponent<ListHeaderProps2> = ({
  icon,
  tooltip,
  children,
  subtitle,
}) => {
  return (
    <Box direction="vertical">
      <Box direction="horizontal">
        <SvgIcon color="alternative" icon={icon} />
        {tooltip ? (
          <Tooltip content={tooltip}>
            <Text color="default">
              <Bold>{children}</Bold>
            </Text>
          </Tooltip>
        ) : (
          <Text color="default">
            <Bold>{children}</Bold>
          </Text>
        )}
      </Box>
      {subtitle ? subtitle : null}
    </Box>
  )
}
