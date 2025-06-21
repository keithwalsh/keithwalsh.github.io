import React from 'react'
import { Paper, Typography, Box, TextField, Button, Alert } from '@mui/material'
import { ContentCopy } from '@mui/icons-material'

interface CronExpressionResultProps {
  cronExpression: string
  description: string
  onCopy: () => void
}

const CronExpressionResult: React.FC<CronExpressionResultProps> = ({
  cronExpression,
  description,
  onCopy,
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Typography variant="h6">Generated Cron Expression</Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          fullWidth
          value={cronExpression}
          variant="outlined"
          sx={{ fontFamily: 'monospace' }}
          InputProps={{
            readOnly: true,
            style: { fontFamily: 'monospace', fontSize: '1.2rem' },
          }}
        />
        <Button
          variant="contained"
          startIcon={<ContentCopy />}
          onClick={onCopy}
        >
          Copy
        </Button>
      </Box>

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Description:</strong> {description}
        </Typography>
      </Alert>
    </Paper>
  )
}

export default CronExpressionResult
