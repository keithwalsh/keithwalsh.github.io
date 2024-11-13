/**
 * @fileoverview Application entry point that sets up the root React component with
 * MUI theming and a responsive navigation layout with persistent drawer.
 */

import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline, Box, IconButton, Toolbar, useMediaQuery } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AboutPage, ContactPage, ToolsPage, ProjectsPage } from "./components/pages";
import { StyledAppBar, StyledTitle, AccessibilityIconButton, StyledDrawer, Main } from "./components/StyledComponents";
import { DrawerContent } from "./components/DrawerContent";
import { AccessibilityMenu } from "./components/AccessibilityMenu";
import {
    Menu as MenuIcon,
    MenuOpen as MenuOpenIcon,
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
    AccessibilityNew as AccessibilityNewIcon,
} from "@mui/icons-material";

export function App() {
    const [open, setOpen] = useState(() => window.innerWidth >= 600);
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
                        <AccessibilityMenu anchorEl={anchorEl} open={isAccessibilityMenuOpen} onClose={handleAccessibilityClose} />
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
                        <DrawerContent isDesktop={isDesktop} setOpen={setOpen} />
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
