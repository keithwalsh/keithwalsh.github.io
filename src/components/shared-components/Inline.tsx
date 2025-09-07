import React from 'react'
import { Stack, Divider, useMediaQuery, useTheme } from '@mui/material'

interface InlineProps {
  children?: React.ReactNode
  sx?: object
  showDivider?: boolean
}

export const Inline: React.FC<InlineProps> = ({
  children,
  sx = {},
  showDivider = true,
}) => {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Stack
      direction={{ sm: 'column', md: 'row' }}
      spacing={{ xs: 1, sm: 2, md: 2, lg: 4, xl: 6 }}
      divider={
        showDivider ? (
          <Divider orientation={isMdUp ? 'vertical' : 'horizontal'} flexItem />
        ) : undefined
      }
      sx={{
        px: 0,
        ...sx,
      }}
    >
      {children}
    </Stack>
  )
}

export default Inline
