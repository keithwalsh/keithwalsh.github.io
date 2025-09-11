/**
 * @fileoverview Instructions card component that displays step-by-step guidance
 * for using the browser window mockup functionality.
 */

import { Card, CardContent, Typography } from '@mui/material'
import { ReactNode } from 'react'

interface InstructionsCardProps {
  /** The heading text for the instructions */
  heading: string
  /** The body content - can be a string, JSX, or ReactNode */
  body: ReactNode
  /** Optional custom heading ID for accessibility */
  headingId?: string
}

/**
 * A reusable card component that displays instructional guidance with themed styling.
 *
 * @param props - The component props
 * @returns The InstructionsCard component
 */
function InstructionsCard({ heading, body, headingId = 'instructions-heading' }: InstructionsCardProps) {

  return (
    <Card
      component="section"
      role="region"
      aria-labelledby={headingId}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        minHeight: 210,
        minWidth: { xs: 280, sm: 280, md: 290, lg: 370, xl: 370 },
      }}
    >
      <CardContent sx={{ width: '100%' }}>
        <Typography
          id={headingId}
          variant="h6"
          component="h2"
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            mb: 1.5,
            color: 'text.primary',
          }}
        >
          {heading}
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
          {body}
        </Typography>
      </CardContent>
    </Card>
  )
}

export { InstructionsCard }
