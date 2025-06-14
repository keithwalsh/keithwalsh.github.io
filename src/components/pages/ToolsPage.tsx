/**
 * @fileoverview Contact page component providing contact information and support
 * details.
 */

import { Box, Container, Typography } from '@mui/material'
import { MarkdownTablePage } from './MarkdownTable'
import { CodeAnnotatorPage } from './CodeAnnotatorPage'

interface ToolsPageProps {
  type?: 'json-explorer' | 'markdown-table' | 'code-annotator'
}

export function ToolsPage({ type }: ToolsPageProps) {
  const getTitle = () => {
    switch (type) {
      case 'json-explorer':
        return 'JSON Explorer'
      case 'markdown-table':
        return 'Markdown Table Generator'
      case 'code-annotator':
        return 'Code Annotator'
      default:
        return 'Tools'
    }
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ p: 0, m: 0, '& .MuiContainer-root': { p: 0 } }}
    >
      <Box sx={{ mt: 2, '& .MuiBox-root': { p: 0 } }}>
        <Typography variant="h4" gutterBottom>
          {getTitle()}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {type === 'json-explorer' && 'Explore JSON data in a tree view.'}
          {type === 'markdown-table' &&
            'Convert tabular data into markdown tables.'}
          {!type && 'This is the Tools page. Learn more about our app here.'}
          {type === 'code-annotator' && 'Annotate code with comments.'}
        </Typography>
        {type === 'markdown-table' && <MarkdownTablePage />}
        {type === 'code-annotator' && <CodeAnnotatorPage />}
      </Box>
    </Container>
  )
}
