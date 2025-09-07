/**
 * @fileoverview Instructions card component that displays step-by-step guidance
 * for using the browser window mockup functionality.
 */

import { Card, CardContent, Typography, useTheme } from '@mui/material'

/**
 * A card component that displays instructional guidance for the browser window
 * mockup functionality with themed styling.
 *
 * @returns The InstructionsCard component
 */
function InstructionsCard() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Card
      component="section"
      role="region"
      aria-labelledby="instructions-heading"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        minHeight: 210,
        minWidth: { xs: 280, sm: 280, md: 290, lg: 370, xl: 370 },
        mb: 3,
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : undefined,
        transition: 'all 0.3s ease',
      }}
    >
      <CardContent sx={{ width: '100%' }}>
        <Typography
          id="instructions-heading"
          variant="h6"
          component="h2"
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            mb: 1.5,
            color: 'text.primary',
          }}
        >
          How to Use
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          component="div"
          sx={{
            textAlign: 'left',
            '& ol': {
              paddingLeft: 2.5,
              marginTop: 0.5,
              marginBottom: 0.5,
            },
            '& li': {
              marginBottom: 0.75,
            },
          }}
        >
          <ol>
            <li>Drag and drop or click to select an image</li>
            <li>Image appears in browser mockup after upload</li>
            <li>Adjust the browser window width using the slider</li>
            <li>Click on the URL bar to edit the displayed address</li>
            <li>Click "Download" to save the mockup</li>
          </ol>
        </Typography>
      </CardContent>
    </Card>
  )
}

export default InstructionsCard
