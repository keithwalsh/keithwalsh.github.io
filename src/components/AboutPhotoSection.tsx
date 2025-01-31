/**
 * @fileoverview Profile photo section with animated border and introduction text.
 */

import { Box, Typography, useTheme } from "@mui/material"

export function AboutPhotoSection() {
    const theme = useTheme()

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                mb: 6,
                position: 'relative'
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    width: 200,
                    height: 200,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -4,
                        left: -4,
                        right: -4,
                        bottom: -4,
                        background: 'linear-gradient(45deg, primary.main, secondary.main)',
                        borderRadius: '50%',
                        animation: 'spin 10s linear infinite',
                        opacity: 0.7
                    },
                    '@keyframes spin': {
                        '0%': {
                            transform: 'rotate(0deg)',
                        },
                        '100%': {
                            transform: 'rotate(360deg)',
                        }
                    }
                }}
            >
                <Box
                    component="img"
                    src="/photo.jpg"
                    alt="Profile photo of Keith Walsh"
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        position: 'relative',
                        zIndex: 1,
                        border: '4px solid white',
                        boxShadow: `0 8px 32px ${theme.palette.primary.main}25`,
                        ...(theme.palette.mode === 'dark' && {
                            filter: 'brightness(0.8)'
                        })
                    }}
                />
            </Box>
            <Box 
                sx={{ 
                    flex: 1,
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: -20,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        background: 'linear-gradient(to bottom, transparent, primary.main, transparent)',
                        opacity: 0.3
                    }
                }}
            >
                <Typography 
                    variant="body1" 
                    paragraph 
                    sx={{ 
                        fontSize: '1.1rem', 
                        maxWidth: '800px',
                        position: 'relative',
                        pl: 2,
                        pr: 1,
                        '&::before': {
                            content: 'open-quote',
                            fontSize: '4rem',
                            color: 'info.main',
                            position: 'absolute',
                            top: -20,
                            left: -20
                        },
                        '&::after': {
                            content: 'close-quote',
                            fontSize: '4rem',
                            color: 'info.main',
                            position: 'absolute',
                            bottom: -50,
                            right: 0
                        }
                    }}
                >
                    Data Analyst with 15+ years of experience delivering actionable insights, automating data workflows, 
                    and developing advanced data solutions. Skilled at transforming complex datasets into intuitive 
                    dashboards and analytical reports that drive strategic decisions. Adept at collaborating across 
                    departments, bridging technical and non-technical perspectives, and optimising operations through 
                    Python, SQL, and leading analytics tools.
                </Typography>
            </Box>
        </Box>
    )
}
