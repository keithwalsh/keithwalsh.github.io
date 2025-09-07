/**
 * @fileoverview Browser window component that displays an image within a
 * resizable browser-like interface with URL bar and window controls.
 */

import { useRef, forwardRef, useImperativeHandle } from 'react'
import {
  Box,
  Slider,
  Paper,
  Button,
  useTheme,
} from '@mui/material'
import { Download } from '@mui/icons-material'
import { useEditableState, useSliderState } from '../../hooks'

/**
 * Props for the BrowserWindow component.
 */
interface BrowserWindowProps {
  /** The URL of the image to display in the browser window */
  imageUrl: string
  /** The initial URL to display in the address bar */
  url?: string
  /** The initial width of the browser window in pixels */
  initialWidth?: number
  /** Callback function for the download button */
  onDownload?: () => void
  /** Whether the download is in progress */
  isDownloading?: boolean
}

/**
 * Ref interface for BrowserWindow component.
 */
export interface BrowserWindowRef {
  /** Get the browser window element for downloading */
  getBrowserWindowElement: () => HTMLElement | null
}

/**
 * A browser window component that displays an image within a resizable,
 * browser-like interface with interactive URL bar and macOS-style window controls.
 * Supports dark and light themes with smooth transitions.
 */
const BrowserWindow = forwardRef<BrowserWindowRef, BrowserWindowProps>(
  (
    {
      imageUrl,
      url: initialUrl = 'http://localhost:3000',
      initialWidth = 800,
      onDownload,
      isDownloading = false,
    },
    ref
  ) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const browserWindowRef = useRef<HTMLDivElement>(null)

    // Expose the browser window element through ref
    useImperativeHandle(ref, () => ({
      getBrowserWindowElement: () => browserWindowRef.current,
    }))

    // Use custom hooks for state management
    const {
      value: url,
      isEditing: isEditingUrl,
      handleChange: handleUrlChange,
      handleKeyDown: handleUrlKeyDown,
      handleBlur: handleUrlBlur,
      handleClick: handleUrlClick,
    } = useEditableState(initialUrl)

    const { value: width, handleChange: handleResize } = useSliderState(
      initialWidth,
      {
        min: 400,
        max: 1000,
        step: 10,
      }
    )

    // Handle menu click for browser controls
    const handleMenuClick = () => {
      // Menu functionality can be implemented here
      console.log('Menu clicked')
    }

    return (
      <Box
        aria-label="Browser window mockup"
        sx={{ width: 'fit-content', minWidth: 0 }}
      >
        <Box sx={{ ml: 3, mr: 0, mb: 1, mt: 0 }}>
          <Slider
            value={width}
            onChange={handleResize}
            aria-labelledby="window-width-slider"
            aria-describedby="width-description"
            valueLabelDisplay="auto"
            valueLabelFormat={value => `${value}px`}
            step={10}
            marks={[
              { value: 400, label: '400px' },
              { value: 700, label: '700px' },
              { value: 1000, label: '1000px' },
            ]}
            min={400}
            max={1000}
            sx={{
              width: { xs: 450, sm: 320, md: 550, lg: 680, xl: 740 },
              '& .MuiSlider-thumb': {
                '&:focus-visible': {
                  boxShadow: `0 0 0 3px ${theme.palette.primary.main}40`,
                },
              },
            }}
          />
        </Box>

        {onDownload && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'left',
              ml: { xs: 22.75, sm: 14.5, md: 29, lg: 32 },
            }}
          >
            <Button
              variant="contained"
              color="success"
              startIcon={<Download />}
              onClick={onDownload}
              disabled={isDownloading}
              aria-label="Download browser window as PNG image"
              aria-describedby="download-description"
              sx={{
                transition: 'all 0.3s ease',
                fontWeight: 500,
                '&:focus-visible': {
                  outline: '3px solid',
                  outlineColor: 'success.main',
                  outlineOffset: '2px',
                },
              }}
            >
              {isDownloading ? 'Downloading...' : 'Download'}
            </Button>
          </Box>
        )}

        <Paper
          ref={browserWindowRef}
          elevation={isDark ? 3 : 1}
          sx={{
            width: `${width}px !important`,
            margin: '1rem auto !important',
            overflow: 'hidden !important',
            borderRadius: '1 !important',
            transition: 'all 0.3s ease !important',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important`,
          }}
        >
          <Box
            component="header"
            role="banner"
            aria-label="Browser window controls and address bar"
            sx={{
              display: 'flex !important',
              alignItems: 'center !important',
              padding: '0.25rem 1rem !important',
              backgroundColor:
                isDark
                  ? 'rgba(255,255,255,0.05) !important'
                  : 'rgba(0,0,0,0.05) !important',
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important`,
            }}
          >
            <Box sx={{ whiteSpace: 'nowrap' }}>
              <Box 
                component="span" 
                sx={{ 
                  marginRight: '6px',
                  marginTop: '4px',
                  height: '12px',
                  width: '12px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  background: '#f25f58'
                }} 
              />
              <Box 
                component="span" 
                sx={{ 
                  marginRight: '6px',
                  marginTop: '4px',
                  height: '12px',
                  width: '12px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  background: '#fbbe3c'
                }} 
              />
              <Box 
                component="span" 
                sx={{ 
                  marginRight: '6px',
                  marginTop: '4px',
                  height: '12px',
                  width: '12px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  background: '#58cb42'
                }} 
              />
            </Box>

            <Box
              component="div"
              role="textbox"
              aria-label="Website URL address bar"
              aria-describedby="url-instructions"
              tabIndex={isEditingUrl ? -1 : 0}
              onClick={handleUrlClick}
              onKeyDown={e => {
                if ((e.key === 'Enter' || e.key === ' ') && !isEditingUrl) {
                  e.preventDefault()
                  handleUrlClick()
                }
              }}
              sx={{
                flex: '1 0 !important',
                margin: '0 1rem 0 0.5rem !important',
                borderRadius: '12.5px !important',
                backgroundColor:
                  isDark
                    ? 'rgba(0,0,0,0.3) !important'
                    : 'rgba(255,255,255,0.8) !important',
                color:
                  isDark
                    ? 'rgba(255,255,255,0.8) !important'
                    : 'rgba(0,0,0,0.8) !important',
                padding: '5px 15px !important',
                fontSize: '13px !important',
                fontFamily: 'Arial, sans-serif !important',
                overflow: 'hidden !important',
                textOverflow: 'ellipsis !important',
                whiteSpace: 'nowrap !important',
                cursor: 'text !important',
                transition: 'all 0.3s ease !important',
                '&:focus-visible': {
                  outline: `2px solid ${theme.palette.primary.main} !important`,
                  outlineOffset: '2px !important',
                },
                '&:hover': {
                  backgroundColor:
                    isDark
                      ? 'rgba(0,0,0,0.4) !important'
                      : 'rgba(255,255,255,0.9) !important',
                },
              }}
            >
              {isEditingUrl ? (
                <input
                  type="text"
                  value={url}
                  onChange={handleUrlChange}
                  onBlur={handleUrlBlur}
                  onKeyDown={handleUrlKeyDown}
                  aria-label="Edit website URL"
                  aria-describedby="url-edit-instructions"
                  style={{
                    width: '100% !important',
                    border: 'none !important',
                    outline: 'none !important',
                    fontSize: '13px !important',
                    fontFamily: 'Arial, sans-serif !important',
                    background: 'transparent !important',
                    color:
                      isDark
                        ? 'rgba(255,255,255,0.9) !important'
                        : 'rgba(0,0,0,0.9) !important',
                  }}
                  autoFocus
                />
              ) : (
                url
              )}
            </Box>

            {/* Hidden instructions for screen readers */}
            <Box
              id="url-instructions"
              sx={{
                position: 'absolute !important',
                left: '-10000px !important',
                width: '1px !important',
                height: '1px !important',
                overflow: 'hidden !important',
              }}
            >
              Click or press Enter to edit the URL
            </Box>
            <Box
              id="url-edit-instructions"
              sx={{
                position: 'absolute !important',
                left: '-10000px !important',
                width: '1px !important',
                height: '1px !important',
                overflow: 'hidden !important',
              }}
            >
              Press Enter to save, Escape to cancel
            </Box>

            <Box sx={{ marginLeft: 'auto', position: 'relative !important' }}>
              <Box
                component="button"
                role="button"
                aria-label="Browser menu"
                tabIndex={0}
                onClick={handleMenuClick}
                sx={{
                  background: 'transparent !important',
                  border: 'none !important',
                  cursor: 'pointer !important',
                  padding: '4px !important',
                  borderRadius: '4px !important',
                  '&:focus-visible': {
                    outline: `2px solid ${theme.palette.primary.main} !important`,
                    outlineOffset: '2px !important',
                  },
                  '&:hover': {
                    backgroundColor:
                      isDark
                        ? 'rgba(255,255,255,0.1) !important'
                        : 'rgba(0,0,0,0.1) !important',
                  },
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleMenuClick()
                  }
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: '17px !important',
                    height: '3px !important',
                    backgroundColor:
                      isDark
                        ? 'rgba(255,255,255,0.6) !important'
                        : 'rgba(0,0,0,0.6) !important',
                    margin: '3px 0 !important',
                    display: 'block !important',
                    transition: 'background-color 0.3s ease !important',
                  }}
                />
                <Box
                  component="span"
                  sx={{
                    width: '17px !important',
                    height: '3px !important',
                    backgroundColor:
                      isDark
                        ? 'rgba(255,255,255,0.6) !important'
                        : 'rgba(0,0,0,0.6) !important',
                    margin: '3px 0 !important',
                    display: 'block !important',
                    transition: 'background-color 0.3s ease',
                  }}
                />
                <Box
                  component="span"
                  sx={{
                    width: '17px !important',
                    height: '3px !important',
                    backgroundColor:
                      isDark
                        ? 'rgba(255,255,255,0.6) !important'
                        : 'rgba(0,0,0,0.6) !important',
                    margin: '3px 0 !important',
                    display: 'block !important',
                    transition: 'background-color 0.3s ease !important',
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box
            component="main"
            role="main"
            aria-label="Browser window content area"
            sx={{
              padding: '0.5rem !important',
              transition: 'background-color 0.3s ease !important',
            }}
          >
            <img
              src={imageUrl}
              alt="User-uploaded content displayed in browser window mockup"
              loading="lazy"
              style={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'contain',
                display: 'block',
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px',
              }}
            />
          </Box>
        </Paper>

        {/* Hidden descriptions for screen readers */}
        <Box
          id="download-description"
          sx={{
            position: 'absolute !important',
            left: '-10000px !important',
            width: '1px !important',
            height: '1px !important',
            overflow: 'hidden !important',
          }}
        >
          Downloads the browser window mockup as a PNG image file
        </Box>
      </Box>
    )
  }
)

BrowserWindow.displayName = 'BrowserWindow'

export default BrowserWindow
