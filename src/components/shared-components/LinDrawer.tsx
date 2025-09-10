import { styled } from "@mui/material/styles";
import { Drawer } from "@mui/material";

const DRAWER_WIDTH = 240

export const LinDrawer = styled(Drawer, {
    shouldForwardProp: prop => prop !== 'isDesktop',
  })<{ isDesktop: boolean }>(({ theme }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    marginTop: '56px',
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
      position: 'fixed',
      height: '100%',
      borderRight:
        theme.palette.mode === 'dark'
          ? '1px solid rgba(255, 255, 255, 0.12)'
          : '1px solid rgba(0, 0, 0, 0.12)',
      zIndex: theme.zIndex.drawer,
      marginTop: '56px',
    },
    '& .MuiBackdrop-root': {
      zIndex: theme.zIndex.drawer - 1,
      marginTop: '56px',
    },
  }))