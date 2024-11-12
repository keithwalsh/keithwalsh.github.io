/**
 * @fileoverview Application entry point that sets up the root React component with
 * MUI theming and a responsive navigation layout with persistent drawer.
 */

import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { styled } from "@mui/material/styles";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import {
    AppBar,
    Box,
    Drawer,
    IconButton,
    Toolbar,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useMediaQuery,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { MenuOpen as MenuOpenIcon } from "@mui/icons-material";
import { DarkMode as DarkModeIcon } from "@mui/icons-material";
import { LightMode as LightModeIcon } from "@mui/icons-material";
import { AccessibilityNew as AccessibilityNewIcon } from "@mui/icons-material";
import { TextIncrease as TextIncreaseIcon } from "@mui/icons-material";
import { TextDecrease as TextDecreaseIcon } from "@mui/icons-material";
import ContrastIcon from "@mui/icons-material/Contrast";
import AccessibleIcon from "@mui/icons-material/Accessible";
import { Routes, Route, BrowserRouter, useMatch } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { ListItemButtonProps } from "@mui/material";
import { AboutPage, ContactPage, ToolsPage, ProjectsPage } from "./components/pages";
import HomeIcon from "@mui/icons-material/Home";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import BuildIcon from "@mui/icons-material/Build";
import WorkIcon from "@mui/icons-material/Work";

const DRAWER_WIDTH = 240;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    borderBottom: theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
}));

const StyledTitle = styled(Typography)<{ component?: React.ElementType }>(({ theme }) => ({
    flexGrow: 1,
    color: theme.palette.mode === "dark" ? "#90caf9" : "inherit",
}));

const AccessibilityIconButton = styled(IconButton)(({ theme }) => ({
    marginLeft: theme.spacing(2),
    color: theme.palette.mode === "dark" ? "#90caf9" : "inherit",
}));

const StyledListItem = styled(ListItem)({
    padding: 0,
    overflowX: "hidden",
});

const StyledListItemText = styled(ListItemText)({
    whiteSpace: "nowrap",
    zIndex: 1,
    "& .MuiTypography-root": {
        fontWeight: "500",
    },
});

const StyledDrawer = styled(Drawer, {
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
    },
}));

const MenuPaper = styled("div")(({ theme }) => ({
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    marginTop: theme.spacing(0.75),
    zIndex: 1200,
    "& .MuiAvatar-root": {
        width: 32,
        height: 32,
        marginLeft: -0.5,
        marginRight: 1,
    },
    "&::before": {
        content: '""',
        display: "block",
        position: "absolute",
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        backgroundColor: theme.palette.background.paper,
        transform: "translateY(-50%) rotate(45deg)",
        zIndex: 0,
        boxShadow: "-1px -1px 1px rgba(0,0,0,0.12)",
    },
}));

/** Styled main content container with dynamic margins and smooth transitions based on drawer state */
const Main = styled("main", {
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
}));

/** Styled navigation button with rounded corners and dynamic colors for selected state */
const NavigationListItemButton = styled(ListItemButton)<ListItemButtonProps<typeof RouterLink>>(({ theme }) => ({
    borderRadius: 8,
    "& .MuiSvgIcon-root": {
        color: theme.palette.action.active,
    },
    "&.Mui-selected": {
        "& .MuiListItemIcon-root, & .MuiTypography-root, & .MuiSvgIcon-root": {
            color: theme.palette.primary.main,
        },
    },
}));

/** Navigation item structure for sidebar menu items with path, label, icon, and optional divider */
interface NavigationItem {
    path: string;
    label: string;
    icon: React.ReactElement;
    showDividerBelow?: boolean;
}

/** Defines navigation routes, labels and icons for the application sidebar */
const NAVIGATION_ITEMS: NavigationItem[] = [
    { path: "/", label: "About", icon: <HomeIcon /> },
    { path: "/contact", label: "Contact", icon: <ContactMailIcon />, showDividerBelow: true },
    { path: "/tools", label: "Tools", icon: <BuildIcon /> },
    { path: "/projects", label: "Projects", icon: <WorkIcon /> },
];

/** Root application component with responsive drawer layout, theme management, and navigation */
export function App() {
    const [open, setOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("darkMode");
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isAccessibilityMenuOpen = Boolean(anchorEl);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: isDarkMode ? "dark" : "light",
                },
            }),
        [isDarkMode]
    );

    const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

    const handleDrawerToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode: boolean) => {
            const newMode = !prevMode;
            localStorage.setItem("darkMode", JSON.stringify(newMode));
            return newMode;
        });
    };

    const handleAccessibilityClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAccessibilityClose = () => {
        setAnchorEl(null);
    };

    const drawerContent = (
        <Box sx={{ p: 2 }}>
            <List sx={{ padding: 0 }}>
                {NAVIGATION_ITEMS.map(({ path, label, icon, showDividerBelow }) => {
                    const match = useMatch({ path, end: true });
                    return (
                        <React.Fragment key={path}>
                            <StyledListItem disablePadding>
                                <NavigationListItemButton
                                    component={RouterLink}
                                    to={path}
                                    selected={Boolean(match)}
                                    onClick={() => !isDesktop && setOpen(false)}
                                    sx={{
                                        px: 1.4,
                                        height: 48,
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
                                    <StyledListItemText primary={label} />
                                </NavigationListItemButton>
                            </StyledListItem>
                            {showDividerBelow && <Divider sx={{ my: 1 }} />}
                        </React.Fragment>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <StyledAppBar position="relative" elevation={0}>
                    <Toolbar>
                        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ ml: 2, mr: 2 }}>
                            {open ? <MenuOpenIcon /> : <MenuIcon />}
                        </IconButton>
                        <StyledTitle variant="h6" noWrap component="div">
                            Keith Walsh
                        </StyledTitle>
                        <AccessibilityIconButton
                            color="inherit"
                            onClick={handleAccessibilityClick}
                            aria-controls={isAccessibilityMenuOpen ? "accessibility-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={isAccessibilityMenuOpen ? "true" : undefined}
                        >
                            <AccessibilityNewIcon />
                        </AccessibilityIconButton>
                        <Menu
                            anchorEl={anchorEl}
                            id="accessibility-menu"
                            open={isAccessibilityMenuOpen}
                            onClose={handleAccessibilityClose}
                            onClick={handleAccessibilityClose}
                            slotProps={{
                                paper: {
                                    elevation: 0,
                                    component: MenuPaper,
                                },
                            }}
                            transformOrigin={{ horizontal: "right", vertical: "top" }}
                            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        >
                            <MenuItem onClick={handleAccessibilityClose}>
                                <ListItemIcon>
                                    <TextIncreaseIcon fontSize="small" />
                                </ListItemIcon>
                                Increase Font Size
                            </MenuItem>
                            <MenuItem onClick={handleAccessibilityClose}>
                                <ListItemIcon>
                                    <TextDecreaseIcon fontSize="small" />
                                </ListItemIcon>
                                Decrease Font Size
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleAccessibilityClose}>
                                <ListItemIcon>
                                    <ContrastIcon fontSize="small" />
                                </ListItemIcon>
                                High Contrast
                            </MenuItem>
                            <MenuItem onClick={handleAccessibilityClose}>
                                <ListItemIcon>
                                    <AccessibleIcon fontSize="small" />
                                </ListItemIcon>
                                Screen Reader
                            </MenuItem>
                        </Menu>
                        <IconButton
                            color="inherit"
                            onClick={toggleDarkMode}
                            sx={{
                                color: theme.palette.mode === "dark" ? "#90caf9" : "inherit",
                            }}
                        >
                            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Toolbar>
                </StyledAppBar>

                <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
                    <StyledDrawer
                        variant={isDesktop ? "persistent" : "temporary"}
                        open={open}
                        onClose={handleDrawerToggle}
                        ModalProps={{ keepMounted: true }}
                        isDesktop={isDesktop}
                    >
                        {drawerContent}
                    </StyledDrawer>

                    <Main open={open}>
                        <Routes>
                            <Route path="/" element={<AboutPage />} />
                            <Route path="/projects" element={<ProjectsPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/tools" element={<ToolsPage />} />
                        </Routes>
                    </Main>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
