/**
 * @fileoverview Education and certifications section displaying academic and professional credentials.
 */

import { Box, Grid, Paper, Typography } from "@mui/material"

export function EducationCerts() {
    return (
        <>
            <Typography variant="h5" sx={{ mt: 6, mb: 4, fontWeight: 'bold' }}>
                Education & Certifications
            </Typography>

            <Box sx={{ mb: 4 }}>
                <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
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
                                <Typography variant="h6" gutterBottom>Education</Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                        B.Sc. Engineering with Management
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Trinity College Dublin, 2010
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
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
                                <Typography variant="h6" gutterBottom>Recent Certifications</Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                        GCP Associate Cloud Engineer
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Google, 2025
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                        Google Data Analytics Professional Certificate
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Google, 2025
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                        GitHub Foundations Certification
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        GitHub, 2025
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                </Grid>
            </Box>
        </>
    )
}
