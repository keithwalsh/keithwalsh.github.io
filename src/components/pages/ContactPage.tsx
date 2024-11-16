/**
 * @fileoverview Contact page component providing contact information and a form for
 * user inquiries. Includes IP-based country detection for phone input.
 */

import { Box, Container, Typography, Alert } from "@mui/material"
import { SocialLinks } from "../SocialLinks"
import { ContactForm } from "../ContactForm"
import { useState, useEffect } from 'react'
import axios from 'axios'
import type { MuiTelInputProps } from 'mui-tel-input'

type CountryCode = MuiTelInputProps['defaultCountry']

interface AlertState {
    open: boolean
    message: string
    severity: 'success' | 'error'
}

interface GeoLocation {
    country_code: string
}

export function ContactPage() {
    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: '',
        severity: 'success' as const
    })
    const [countryCode, setCountryCode] = useState<CountryCode>('US')

    useEffect(() => {
        const detectCountry = async () => {
            try {
                const { data } = await axios.get<GeoLocation>('https://ipapi.co/json/')
                setCountryCode(data.country_code.toUpperCase() as CountryCode)
            } catch (error) {
                console.error('Failed to detect country:', error)
                setCountryCode('US')
            }
        }

        detectCountry()
    }, [])

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
                    <ContactForm onAlert={handleAlert} defaultCountry={countryCode} />
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
