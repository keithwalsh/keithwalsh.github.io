import React, { useState, useEffect } from 'react'
import { Container, Paper, Stack, Snackbar, Alert } from '@mui/material'
import { CronSyntaxBar } from './components'
import {
  CronExpressionResult,
  CronBuilder,
  CommonExpressions,
} from './components'
import { generateDescription } from './utils/cronHelpers'
import type { CronField } from './types/cron'

const CronExpressions: React.FC = () => {
  const [cronFields, setCronFields] = useState<CronField>({
    minutes: '*',
    hours: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*',
  })

  const [cronExpression, setCronExpression] = useState<string>('* * * * *')
  const [description, setDescription] = useState<string>('')
  const [copySuccess, setCopySuccess] = useState<boolean>(false)
  const [copyError, setCopyError] = useState<string>('')

  // Update cron expression when fields change
  useEffect(() => {
    const newExpression = `${cronFields.minutes} ${cronFields.hours} ${cronFields.dayOfMonth} ${cronFields.month} ${cronFields.dayOfWeek}`
    setCronExpression(newExpression)
    setDescription(generateDescription(cronFields))
  }, [cronFields])

  const handleFieldChange = (field: keyof CronField, value: string) => {
    setCronFields((prev: CronField) => ({ ...prev, [field]: value }))
  }

  const loadCommonExpression = (expression: string) => {
    const parts = expression.split(' ')
    setCronFields({
      minutes: parts[0],
      hours: parts[1],
      dayOfMonth: parts[2],
      month: parts[3],
      dayOfWeek: parts[4],
    })
  }

  const copyToClipboard = async () => {
    try {
      // Reset previous states
      setCopySuccess(false)
      setCopyError('')

      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(cronExpression)
        setCopySuccess(true)
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea')
        textArea.value = cronExpression
        textArea.style.position = 'absolute'
        textArea.style.left = '-999999px'
        document.body.prepend(textArea)
        textArea.select()

        try {
          document.execCommand('copy')
          setCopySuccess(true)
        } catch (error) {
          console.error('Fallback copy failed:', error)
          setCopyError('Copy failed. Please manually copy the expression.')
        } finally {
          textArea.remove()
        }
      }
    } catch (error) {
      console.error('Copy to clipboard failed:', error)
      setCopyError('Copy failed. Please manually copy the expression.')
    }
  }

  const handleCloseSnackbar = () => {
    setCopySuccess(false)
    setCopyError('')
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={3}>
        {/* Builder Interface */}
        <CronBuilder
          cronFields={cronFields}
          onFieldChange={handleFieldChange}
        />

        {/* Cron Expression Result */}
        <CronExpressionResult
          cronExpression={cronExpression}
          description={description}
          onCopy={copyToClipboard}
        />

        {/* Common Expressions */}
        <CommonExpressions onExpressionSelect={loadCommonExpression} />

        {/* Cron Syntax Reference */}
        <Paper sx={{ p: 3 }}>
          <CronSyntaxBar />
        </Paper>
      </Stack>

      {/* Success/Error Messages */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Cron expression copied to clipboard!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!copyError}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: '100%' }}
        >
          {copyError}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default CronExpressions
