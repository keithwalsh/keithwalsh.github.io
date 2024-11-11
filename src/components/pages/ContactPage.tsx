/**
 * @fileoverview Contact page component providing contact information and support
 * details.
 */

import { Box, Container, Typography } from "@mui/material";

export function ContactPage() {
    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Contact
                </Typography>
                <Typography variant="body1">Contact us at support@example.com</Typography>
            </Box>
        </Container>
    );
}
