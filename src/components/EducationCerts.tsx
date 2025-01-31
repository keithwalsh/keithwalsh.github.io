/**
 * @fileoverview Education and certifications section displaying academic and professional credentials.
 */

import { Box, Grid, Paper, Typography } from "@mui/material"
import certData from "../data/certifications.json"

interface Certification {
    title: string
    issuer: string
    year: number
}

const StyledPaper = ({ children }: { children: React.ReactNode }) => (
    <Paper 
        elevation={2}
        sx={{
            p: 3,
            height: '100%',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => `0 8px 24px ${theme.palette.action.hover}`,
            }
        }}
    >
        {children}
    </Paper>
)

export function EducationCerts() {
    return (
        <>
            <Typography variant="h5" sx={{ mt: 6, mb: 4, fontWeight: 'bold' }}>
                Education & Certifications
            </Typography>

            <Box sx={{ mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <StyledPaper>
                            <Typography variant="h6" gutterBottom>Education</Typography>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                    B.Sc. Engineering with Management
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Trinity College Dublin, 2010
                                </Typography>
                            </Box>
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <StyledPaper>
                            <Typography variant="h6" gutterBottom>Recent Certifications</Typography>
                            {certData.certifications.map((cert: Certification, index) => (
                                <Box key={`${cert.title}-${index}`} sx={{ mb: index !== certData.certifications.length - 1 ? 2 : 0 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                        {cert.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {cert.issuer}, {cert.year}
                                    </Typography>
                                </Box>
                            ))}
                        </StyledPaper>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
