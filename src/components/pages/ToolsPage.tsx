/**
 * @fileoverview Contact page component providing contact information and support
 * details.
 */

import { Box, Container, Typography } from "@mui/material";
/* Temporarily disabled until implementation is complete
import { MarkdownTablePage } from './MarkdownTable'
*/
interface ToolsPageProps {
    type?: 'json-explorer' | 'markdown-table'
}

export function ToolsPage({ type }: ToolsPageProps) {
    const getTitle = () => {
        switch (type) {
            case 'json-explorer':
                return 'JSON Explorer'
            case 'markdown-table':
                return 'Markdown Table Generator'
            default:
                return 'Tools'
        }
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 2 }}>
                <Typography variant="h4" gutterBottom>
                    {getTitle()}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    {type === 'json-explorer' && 'Explore JSON data in a tree view.'}
                    {type === 'markdown-table' && 'Convert tabular data into markdown tables.'}
                    {!type && 'This is the Tools page. Learn more about our app here.'}
                </Typography>
                {/* Temporarily disabled until implementation is complete
                {type === 'markdown-table' && <MarkdownTablePage />}
                */}
            </Box>
        </Container>
    )
}
