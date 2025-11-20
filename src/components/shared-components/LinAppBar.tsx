import { styled } from "@mui/material/styles";
import { AppBar } from "@mui/material";

export const LinAppBar = styled(AppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundImage: theme.palette.mode === 'dark'
      ? 'none'
      : 'linear-gradient(90deg, #314183 0%, #1F62AE 50%, #0C884C 100%)',
    backgroundColor: theme.palette.mode === 'dark'
      ? 'hsla(210, 14%, 7%, 0.6)'
      : '#314183',
    flexDirection: 'column',
    width: '100%',
    boxSizing: 'border-box',
    flexShrink: 0,
    position: 'fixed',
    top: 0,
    color: "#ffffff",
    left: 'auto',
    right: 0,
    justifyContent: 'center',
    boxShadow: 'none',
    backdropFilter: 'blur(8px)',
    borderBottom: `1px solid ${theme.palette.divider}`,
    minHeight: 57,
  }))