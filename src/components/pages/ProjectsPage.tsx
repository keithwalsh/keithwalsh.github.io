/**
 * @fileoverview Projects page component with a retro 1990s GeoCities style under
 * construction theme.
 */

import { Box, Container, Typography } from "@mui/material"
import { useTheme } from '@mui/material/styles'
import ConstructionIcon from '@mui/icons-material/Construction'

export function ProjectsPage() {
    const theme = useTheme()

    return (
        <Container maxWidth="lg">
            <Box 
                sx={{ 
                    mt: 4,
                    textAlign: 'center',
                    animation: 'blink 1s infinite',
                    '@keyframes blink': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0 },
                        '100%': { opacity: 1 }
                    }
                }}
            >
                <Typography variant="h4" gutterBottom sx={{ color: '#FF0000' }}>
                    <ConstructionIcon sx={{ fontSize: 40, mr: 1 }} />
                    UNDER CONSTRUCTION
                    <ConstructionIcon sx={{ fontSize: 40, ml: 1 }} />
                </Typography>
                
                <Box sx={{ my: 4 }}>
                    <img 
                        src="https://stryvemarketing.com/wp-content/uploads/2016/04/image.gif"
                        alt="Under Construction"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                </Box>

                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontFamily: '"Comic Sans MS", cursive',
                        color: theme.palette.mode === 'dark' ? '#00FF00' : '#0000FF',
                        textShadow: '2px 2px #FF0000'
                    }}
                >
                    🚧 Please excuse our dust! 🚧
                    <br />
                    This page is being updated to serve you better!
                </Typography>

                <Typography 
                    variant="body1" 
                    sx={{ 
                        mt: 2,
                        fontFamily: '"Comic Sans MS", cursive',
                        color: '#800080'
                    }}
                >
                    Best viewed with Netscape Navigator™
                </Typography>
            </Box>
        </Container>
    )
}
