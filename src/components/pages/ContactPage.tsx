/**
 * @fileoverview Contact page component providing contact information and a form for
 * user inquiries.
 */

import { Box, Container, Typography, Alert } from "@mui/material"
import { SocialLinks } from "../SocialLinks"
import { ContactForm } from "../ContactForm"
import { useState } from 'react'

interface AlertState {
    open: boolean
    message: string
    severity: 'success' | 'error'
}

export function ContactPage() {
    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: '',
        severity: 'success' as const
    })

    const handleAlert = (message: string, severity: 'success' | 'error') => {
        setAlert({ open: true, message, severity })
    }

    const handleCloseAlert = () => {
        setAlert(prev => ({ ...prev, open: false }))
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    Let's Connect
                </Typography>
                
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, mt: 6 }}>
                    You can find me here
                </Typography>
                
                <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    mb: 6,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    padding: 4,
                    boxShadow: 3
                }}>
                    <SocialLinks />
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, mt: 6 }}>
                    Or send me a message
                </Typography>

                <Box sx={{ 
                    mt: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    padding: 4,
                    boxShadow: 3
                }}>
                    <ContactForm onAlert={handleAlert} />
                </Box>

                <Box sx={{ mt: 2, width: '100%' }}>
                    <Alert 
                        onClose={handleCloseAlert} 
                        severity={alert.severity}
                        variant="filled"
                        elevation={6}
                        sx={{ 
                            width: '100%',
                            display: alert.open ? 'flex' : 'none'
                        }}
                    >
                        {alert.message}
                    </Alert>
                </Box>
            </Box>
        </Container>
    )
}
