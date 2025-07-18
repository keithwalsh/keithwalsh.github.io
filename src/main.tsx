/**
 * @fileoverview Application entry point that sets up the root React component with
 * MUI theming and a responsive navigation layout with persistent drawer.
 */

import React, { useState, useMemo, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import {
  ThemeProvider,
  CssBaseline,
  Box,
  IconButton,
  Toolbar,
  useMediaQuery,
} from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { Routes, Route, HashRouter, useLocation } from 'react-router-dom'
import {
  AboutPage,
  ContactPage,
  ToolsPage,
  PersonalProjects,
  WorkProjects,
  Weather,
} from './components/pages'
import {
  StyledAppBar,
  StyledTitle,
  AccessibilityIconButton,
  StyledDrawer,
  Main,
} from './components/StyledComponents'
import { DrawerContent } from './components/DrawerContent'
import { AccessibilityMenu } from './components/AccessibilityMenu'
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  AccessibilityNew as AccessibilityNewIcon,
} from '@mui/icons-material'
import emailjs from '@emailjs/browser'
import { initGA, logPageView } from './utils/analytics'

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY)

export function App() {
  const [open, setOpen] = useState(() => window.innerWidth >= 600)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : false
  })
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isAccessibilityMenuOpen = Boolean(anchorEl)

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
        },
      }),
    [isDarkMode]
  )

  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))

  const location = useLocation()

  useEffect(() => {
    initGA()
  }, [])

  useEffect(() => {
    logPageView(location.pathname)
  }, [location])

  const handleDrawerToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode: boolean) => {
      const newMode = !prevMode
      localStorage.setItem('darkMode', JSON.stringify(newMode))
      return newMode
    })
  }

  const handleAccessibilityClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleAccessibilityClose = () => {
    setAnchorEl(null)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <StyledAppBar position="relative" elevation={0}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: 2, mr: 2 }}
            >
              {open ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
            <StyledTitle variant="h6" noWrap component="div">
              Keith Walsh
            </StyledTitle>
            <AccessibilityIconButton
              color="inherit"
              onClick={handleAccessibilityClick}
              aria-controls={
                isAccessibilityMenuOpen ? 'accessibility-menu' : undefined
              }
              aria-haspopup="true"
              aria-expanded={isAccessibilityMenuOpen ? 'true' : undefined}
            >
              <AccessibilityNewIcon />
            </AccessibilityIconButton>
            <AccessibilityMenu
              anchorEl={anchorEl}
              open={isAccessibilityMenuOpen}
              onClose={handleAccessibilityClose}
            />
            <IconButton
              color="inherit"
              onClick={toggleDarkMode}
              sx={{
                color: theme.palette.mode === 'dark' ? '#90caf9' : 'inherit',
              }}
            >
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Toolbar>
        </StyledAppBar>

        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <StyledDrawer
            variant={isDesktop ? 'persistent' : 'temporary'}
            open={open}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            isDesktop={isDesktop}
          >
            <DrawerContent isDesktop={isDesktop} setOpen={setOpen} />
          </StyledDrawer>

          <Main>
            <Routes>
              <Route path="/" element={<AboutPage />} />
              <Route path="/projects/personal" element={<PersonalProjects />} />
              <Route path="/projects/professional" element={<WorkProjects />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/visualizations/weather" element={<Weather />} />
              <Route
                path="/tools/json-explorer"
                element={<ToolsPage type="json-explorer" />}
              />
              <Route
                path="/tools/markdown-table"
                element={<ToolsPage type="markdown-table" />}
              />
              <Route
                path="/tools/code-annotator"
                element={<ToolsPage type="code-annotator" />}
              />
              <Route
                path="/tools/cron-expressions"
                element={<ToolsPage type="cron-expressions" />}
              />
            </Routes>
          </Main>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
