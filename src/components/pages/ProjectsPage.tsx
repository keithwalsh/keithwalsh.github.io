/**
 * @fileoverview Projects page component showcasing portfolio projects and
 * professional work.
 */

import { Box, Container, Typography } from "@mui/material";

export function ProjectsPage() {
    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Projects
                </Typography>
                <Typography variant="body1">Here you'll find a collection of my projects and professional work.</Typography>
            </Box>
        </Container>
    );
}
