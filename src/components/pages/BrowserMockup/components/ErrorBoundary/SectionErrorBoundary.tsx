/**
 * @fileoverview Lightweight error boundary for individual sections that provides
 * minimal fallback UI and allows the rest of the application to continue functioning.
 */

import React, { ReactNode } from 'react'
import { Box, Typography, Button, Alert } from '@mui/material'
import { Warning, Refresh } from '@mui/icons-material'
import ErrorBoundary from './ErrorBoundary'

interface SectionErrorBoundaryProps {
  children: ReactNode
  sectionName?: string
  showRefresh?: boolean
  minimal?: boolean
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

const SectionErrorBoundary: React.FC<SectionErrorBoundaryProps> = ({
  children,
  sectionName = 'section',
  showRefresh = true,
  minimal = false,
  onError,
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error(`Error in ${sectionName}:`, error, errorInfo)
    onError?.(error, errorInfo)
  }

  const fallbackUI = minimal ? (
    <Alert severity="error" sx={{ m: 1 }}>
      <Typography variant="body2">
        Unable to load {sectionName}
      </Typography>
    </Alert>
  ) : (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        textAlign: 'center',
        backgroundColor: 'background.paper',
        border: 1,
        borderColor: 'error.light',
        borderRadius: 1,
        m: 1,
      }}
    >
      <Warning sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
      <Typography variant="h6" gutterBottom>
        {sectionName} unavailable
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        This section encountered an error and couldn't load properly.
      </Typography>
      {showRefresh && (
        <Button
          variant="outlined"
          size="small"
          startIcon={<Refresh />}
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
      )}
    </Box>
  )

  return (
    <ErrorBoundary fallback={fallbackUI} onError={handleError}>
      {children}
    </ErrorBoundary>
  )
}

export default SectionErrorBoundary
