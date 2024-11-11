/**
 * @fileoverview Contact page component providing contact information and support
 * details.
 */

import { Box, Container, Typography } from "@mui/material";

export function ToolsPage() {
    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Tools
                </Typography>
                <Typography variant="body1">This is the Tools page. Learn more about our app here.</Typography>
            </Box>
        </Container>
    );
}
