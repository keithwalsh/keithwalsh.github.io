/**
 * @fileoverview About page component containing information about the application.
 */

import { Box, Container, Typography } from "@mui/material";

export function AboutPage() {
    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    About
                </Typography>
                <Typography variant="body1">This is the About page. Learn more about our app here.</Typography>
            </Box>
        </Container>
    );
}
