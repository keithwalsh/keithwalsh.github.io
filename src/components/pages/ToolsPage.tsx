/**
 * @fileoverview Contact page component providing contact information and support
 * details.
 */

import { Box, Container, Typography } from '@mui/material'
import { MarkdownTablePage } from './MarkdownTable'
import { CodeAnnotator } from './CodeAnnotator/CodeAnnotator'
import { CronExpressions } from './index'
import BrowserMockup from './BrowserMockup/BrowserMockup'
import JsonExplorer from './JsonExplorer/JsonExplorer'

interface ToolsPageProps {
  type?:
    | 'json-explorer'
    | 'markdown-table'
    | 'code-annotator'
    | 'cron-expressions'
    | 'browser-mockup'
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
      case 'cron-expressions':
        return 'Cron Expressions'
      case 'browser-mockup':
        return 'Browser Window Mockup'
      default:
        return 'Tools'
    }
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ p: 0, m: 0, '& .MuiContainer-root': { p: 0 } }}
    >
      <Box sx={{ mt: { xs: 0, sm: 2, md: 2, lg: 2 } , '& .MuiBox-root': { p: 0 } }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            pl: { xs: 1, sm: 3, md: 3, lg: 3, xl: 3 },
          }}>
          {getTitle()}
        </Typography>
        {type === 'json-explorer' && <JsonExplorer />}
        {type === 'markdown-table' && <MarkdownTablePage />}
        {type === 'code-annotator' && <CodeAnnotator />}
        {type === 'cron-expressions' && <CronExpressions />}
        {type === 'browser-mockup' && <BrowserMockup />}
      </Box>
    </Container>
  )
}
