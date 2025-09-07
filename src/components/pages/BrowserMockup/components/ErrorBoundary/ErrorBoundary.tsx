/**
 * @fileoverview React error boundary component that catches JavaScript errors
 * anywhere in the child component tree and displays a fallback UI instead of
 * crashing the entire application.
 */

import React, { Component, ReactNode } from 'react'
import { Box, Typography, Button, Alert, Paper } from '@mui/material'
import { Refresh, BugReport } from '@mui/icons-material'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number>
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  eventId: string | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const eventId = this.generateEventId()
    
    this.setState({
      error,
      errorInfo,
      eventId,
    })

    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props
    const { hasError } = this.state

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys?.some((resetKey, idx) => prevProps.resetKeys?.[idx] !== resetKey)) {
        this.resetErrorBoundary()
      }
    }

    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary()
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  generateEventId = (): string => {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        eventId: null,
      })
    }, 100)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Paper
          elevation={2}
          sx={{
            p: 3,
            m: 2,
            textAlign: 'center',
            backgroundColor: 'error.light',
            color: 'error.contrastText',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <BugReport sx={{ fontSize: 48, color: 'error.main' }} />
            
            <Typography variant="h5" component="h2" gutterBottom>
              Something went wrong
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2, maxWidth: 600 }}>
              We encountered an unexpected error. This has been logged and our team will investigate.
            </Typography>

            {this.state.eventId && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Error ID: {this.state.eventId}
                </Typography>
              </Alert>
            )}

            <Button
              variant="contained"
              color="primary"
              startIcon={<Refresh />}
              onClick={this.resetErrorBoundary}
              sx={{ mt: 1 }}
            >
              Try Again
            </Button>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box sx={{ mt: 3, textAlign: 'left', width: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Error Details (Development Mode)
                </Typography>
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                    {this.state.error.toString()}
                  </Typography>
                </Alert>
                {this.state.errorInfo && (
                  <Alert severity="warning">
                    <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                      {this.state.errorInfo.componentStack}
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
