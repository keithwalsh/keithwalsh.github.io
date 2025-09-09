/**
 * @fileoverview Shared styled components used across multiple chart components
 * for consistent styling and DRY implementation.
 */

import { styled } from '@mui/material/styles'
import {
  AppBar,
  Typography,
  IconButton,
  ListItem,
  ListItemText,
  Drawer,
  ListItemButton,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { ListItemButtonProps } from '@mui/material'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'

const DRAWER_WIDTH = 240

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  borderBottom:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.2)'
      : 'none',
}))

export const StyledTitle = styled(Typography)<{
  component?: React.ElementType
}>(({ theme }) => ({
  flexGrow: 1,
  color: theme.palette.mode === 'dark' ? '#90caf9' : 'inherit',
}))

export const AccessibilityIconButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  color: theme.palette.mode === 'dark' ? '#90caf9' : 'inherit',
}))

export const StyledListItem = styled(ListItem)({
  padding: 0,
  overflowX: 'hidden',
})

export const StyledListItemText = styled(ListItemText)({
  whiteSpace: 'nowrap',
  zIndex: 1,
  '& .MuiTypography-root': {
    fontWeight: '500',
  },
})

export const StyledDrawer = styled(Drawer, {
  shouldForwardProp: prop => prop !== 'isDesktop',
})<{ isDesktop: boolean }>(({ theme, isDesktop }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  '&:not(.MuiDrawer-modal)': {
    // Only apply width changes to non-modal (persistent/permanent) drawers
    width: 'var(--drawer-width, 240px)',
  },
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    position: isDesktop ? 'relative' : 'fixed',
    height: '100%',
    borderRight:
      theme.palette.mode === 'dark'
        ? '1px solid rgba(255, 255, 255, 0.12)'
        : '1px solid rgba(0, 0, 0, 0.12)',
    zIndex: theme.zIndex.drawer,
    marginTop: isDesktop ? 0 : '56px',
  },
  '& .MuiBackdrop-root': {
    zIndex: theme.zIndex.drawer - 1,
    marginTop: isDesktop ? 0 : '56px',
  },
}))

export const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  paddingLeft: 'max(24px, min(5%, 24px))',
  paddingRight: 'max(24px, min(5%, 24px))',
  transition: theme.transitions.create(['margin', 'padding'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  height: '100%',
  overflow: 'auto',
}))

export const NavigationListItemButton = styled(ListItemButton)<
  ListItemButtonProps<typeof RouterLink>
>(({ theme }) => ({
  borderRadius: 8,
  '& .MuiSvgIcon-root': {
    color: theme.palette.action.active,
  },
  '&.Mui-selected': {
    '& .MuiListItemIcon-root, & .MuiTypography-root, & .MuiSvgIcon-root': {
      color: theme.palette.primary.main,
    },
  },
}))

export const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}))

export const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: 'rotate(90deg)',
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255, 255, 255, .05)',
  }),
}))

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}))
