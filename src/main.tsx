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
import {
    Menu as MenuIcon,
    MenuOpen as MenuOpenIcon,
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
    AccessibilityNew as AccessibilityNewIcon,
    TextIncrease as TextIncreaseIcon,
    TextDecrease as TextDecreaseIcon,
    Contrast as ContrastIcon,
    Accessible as AccessibleIcon,
    Home as HomeIcon,
    ContactMail as ContactMailIcon,
    Build as BuildIcon,
    Architecture as ArchitectureIcon,
} from "@mui/icons-material";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { ListItemButtonProps } from "@mui/material";
import { AboutPage, ContactPage, ToolsPage, ProjectsPage } from "./components/pages";

const DRAWER_WIDTH = 240;

// Styled components for push behavior
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
    marginTop: 64, // AppBar height
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: DRAWER_WIDTH,
    }),
}));

const NavigationListItemButton = styled(ListItemButton)<ListItemButtonProps<typeof RouterLink>>(({ theme }) => ({
    borderRadius: 8,
    "&.Mui-selected": {
        backgroundColor: `${theme.palette.primary.main}14`, // 14 is hex for 8% opacity
        "& .MuiListItemIcon-root": {
            color: theme.palette.primary.dark,
        },
        "& .MuiTypography-root": {
            color: theme.palette.primary.dark,
        },
        "& .MuiSvgIcon-root": {
            color: theme.palette.primary.dark,
        },
        "& .MuiTouchRipple-child": {
            backgroundColor: theme.palette.primary.dark,
        },
        "&:hover": {
            backgroundColor: `${theme.palette.primary.main}1F`, // 1F is hex for 12% opacity
        },
    },
    "& .MuiSvgIcon-root": {
        color: theme.palette.action.active,
    },
}));

interface NavigationItem {
    path: string;
    label: string;
    icon: React.ReactElement;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
    { path: "/", label: "About", icon: <HomeIcon /> },
    { path: "/contact", label: "Contact", icon: <ContactMailIcon /> },
    { path: "/tools", label: "Tools", icon: <BuildIcon /> },
    { path: "/projects", label: "Projects", icon: <ArchitectureIcon /> },
];

export function App() {
    const [open, setOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("darkMode");
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const location = useLocation();
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
        setOpen(!open);
    };

    const toggleDarkMode = () => {
        setIsDarkMode((prev: boolean) => {
            const newMode = !prev;
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
                {NAVIGATION_ITEMS.map(({ path, label, icon }) => (
                    <React.Fragment key={path}>
                        <ListItem
                            disablePadding
                            sx={{
                                py: 0,
                                px: 0,
                                overflowX: "hidden",
                            }}
                        >
                            <NavigationListItemButton
                                component={RouterLink}
                                to={path}
                                selected={location.pathname === path}
                                onClick={() => !isDesktop && setOpen(false)}
                                sx={{
                                    px: 1.4,
                                    height: 48,
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
                                <ListItemText
                                    primary={label}
                                    sx={{
                                        whiteSpace: "nowrap",
                                        zIndex: 1,
                                        "& .MuiTypography-root": {
                                            fontWeight: "500",
                                        },
                                    }}
                                />
                            </NavigationListItemButton>
                        </ListItem>
                        {label === "Contact" && <Divider sx={{ my: 1 }} />}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: "flex", "& .MuiBox-root": { padding: "8px !important" } }}>
                <AppBar
                    position="fixed"
                    elevation={0}
                    sx={{
                        zIndex: 1199,
                        borderBottom: theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
                        width: "100%",
                    }}
                >
                    <Toolbar>
                        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ ml: 2, mr: 2 }}>
                            {open ? <MenuOpenIcon /> : <MenuIcon />}
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                flexGrow: 1,
                                color: theme.palette.mode === "dark" ? "#90caf9" : "inherit",
                            }}
                        >
                            Keith Walsh
                        </Typography>
                        <IconButton
                            color="inherit"
                            onClick={handleAccessibilityClick}
                            aria-controls={isAccessibilityMenuOpen ? "accessibility-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={isAccessibilityMenuOpen ? "true" : undefined}
                            sx={{
                                ml: 2,
                                color: theme.palette.mode === "dark" ? "#90caf9" : "inherit",
                            }}
                        >
                            <AccessibilityNewIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            id="accessibility-menu"
                            open={isAccessibilityMenuOpen}
                            onClose={handleAccessibilityClose}
                            onClick={handleAccessibilityClose}
                            slotProps={{
                                paper: {
                                    elevation: 0,
                                    sx: {
                                        overflow: "visible",
                                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                        mt: 0.75,
                                        zIndex: 1200,
                                        "& .MuiAvatar-root": {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        "&::before": {
                                            content: '""',
                                            display: "block",
                                            position: "absolute",
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: theme.palette.background.paper, // Use theme color
                                            transform: "translateY(-50%) rotate(45deg)",
                                            zIndex: 0,
                                            boxShadow: "-1px -1px 1px rgba(0,0,0,0.12)", // Add shadow to pointer
                                        },
                                    },
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
                </AppBar>

                <Drawer
                    variant={isDesktop ? "persistent" : "temporary"}
                    open={open}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: DRAWER_WIDTH,
                            top: "64px", // Position below AppBar
                            height: "calc(100% - 64px)", // Adjust height to account for AppBar
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>

                <Main open={open}>
                    <Routes>
                        <Route path="/" element={<AboutPage />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/tools" element={<ToolsPage />} />
                    </Routes>
                </Main>
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
