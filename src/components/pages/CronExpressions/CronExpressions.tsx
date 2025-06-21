import React, { useState, useEffect } from 'react'
import { Container, Paper, Stack } from '@mui/material'
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cronExpression)
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
    </Container>
  )
}

export default CronExpressions
