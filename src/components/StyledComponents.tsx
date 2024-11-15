import { styled } from "@mui/material/styles"
import { AppBar, Typography, IconButton, ListItem, ListItemText, Drawer, ListItemButton } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"
import { ListItemButtonProps } from "@mui/material"

const DRAWER_WIDTH = 240

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    borderBottom: theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
}))

export const StyledTitle = styled(Typography)<{ component?: React.ElementType }>(({ theme }) => ({
    flexGrow: 1,
    color: theme.palette.mode === "dark" ? "#90caf9" : "inherit",
}))

export const AccessibilityIconButton = styled(IconButton)(({ theme }) => ({
    marginLeft: theme.spacing(2),
    color: theme.palette.mode === "dark" ? "#90caf9" : "inherit",
}))

export const StyledListItem = styled(ListItem)({
    padding: 0,
    overflowX: "hidden",
})

export const StyledListItemText = styled(ListItemText)({
    whiteSpace: "nowrap",
    zIndex: 1,
    "& .MuiTypography-root": {
        fontWeight: "500",
    },
})

export const StyledDrawer = styled(Drawer, {
    shouldForwardProp: (prop) => prop !== "isDesktop",
})<{ isDesktop: boolean }>(({ theme, isDesktop }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
        width: DRAWER_WIDTH,
        boxSizing: "border-box",
        position: isDesktop ? "relative" : "fixed",
        height: "100%",
        borderRight: theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.12)",
        zIndex: theme.zIndex.drawer,
        marginTop: isDesktop ? 0 : "56px",
    },
    "& .MuiBackdrop-root": {
        zIndex: theme.zIndex.drawer - 1,
        marginTop: isDesktop ? 0 : "56px"
    }
}))

export const Main = styled("main", {
    shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    height: "100%",
    overflow: "auto",
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: DRAWER_WIDTH,
    }),
}))

export const NavigationListItemButton = styled(ListItemButton)<ListItemButtonProps<typeof RouterLink>>(({ theme }) => ({
    borderRadius: 8,
    "& .MuiSvgIcon-root": {
        color: theme.palette.action.active,
    },
    "&.Mui-selected": {
        "& .MuiListItemIcon-root, & .MuiTypography-root, & .MuiSvgIcon-root": {
            color: theme.palette.primary.main,
        },
    },
}))
