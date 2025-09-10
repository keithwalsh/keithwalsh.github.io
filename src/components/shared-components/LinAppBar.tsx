import { styled } from "@mui/material/styles";
import { AppBar } from "@mui/material";

export const LinAppBar = styled(AppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundImage: 'none',
    flexDirection: 'column',
    width: '100%',
    boxSizing: 'border-box',
    flexShrink: 0,
    position: 'fixed',
    top: 0,
    color: theme.palette.text.primary,
    left: 'auto',
    right: 0,
    justifyContent: 'center',
    boxShadow: 'none',
    backdropFilter: 'blur(8px)',
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.mode === 'dark'
      ? 'hsla(210, 14%, 7%, 0.6)'
      : 'hsla(0, 0%, 100%, 0.6)',
    minHeight: 57,
  }))