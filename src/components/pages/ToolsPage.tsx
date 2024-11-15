/**
 * @fileoverview Contact page component providing contact information and support
 * details.
 */

import { Box, Container, Typography } from "@mui/material";

interface ToolsPageProps {
    type?: 'development' | 'analytics';
}

export function ToolsPage({ type }: ToolsPageProps) {
    const getTitle = () => {
        switch (type) {
            case 'development':
                return 'Development Tools';
            case 'analytics':
                return 'Analytics Tools';
            default:
                return 'Tools';
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {getTitle()}
                </Typography>
                <Typography variant="body1">
                    {type === 'development' && 'Development tools and resources for programmers.'}
                    {type === 'analytics' && 'Analytics and data visualization tools.'}
                    {!type && 'This is the Tools page. Learn more about our app here.'}
                </Typography>
            </Box>
        </Container>
    );
}
