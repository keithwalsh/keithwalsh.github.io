import React from 'react'
import {
  Paper,
  Typography,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import type { CronField } from '../types/cron'
import { 
  MINUTE_OPTIONS, 
  HOUR_OPTIONS, 
  DAY_OPTIONS, 
  MONTH_OPTIONS, 
  DAY_OF_WEEK_OPTIONS 
} from '../constants/cronOptions'

interface CronBuilderProps {
  cronFields: CronField
  onFieldChange: (field: keyof CronField, value: string) => void
}

const CronBuilder: React.FC<CronBuilderProps> = ({
  cronFields,
  onFieldChange
}) => {

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Build Cron Expression
      </Typography>
      
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <FormControl fullWidth size="small">
          <InputLabel>Minutes</InputLabel>
          <Select
            value={cronFields.minutes}
            label="Minutes"
            onChange={(e) => onFieldChange('minutes', e.target.value)}
          >
            {MINUTE_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Hours</InputLabel>
          <Select
            value={cronFields.hours}
            label="Hours"
            onChange={(e) => onFieldChange('hours', e.target.value)}
          >
            {HOUR_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Day of Month</InputLabel>
          <Select
            value={cronFields.dayOfMonth}
            label="Day of Month"
            onChange={(e) => onFieldChange('dayOfMonth', e.target.value)}
          >
            {DAY_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Month</InputLabel>
          <Select
            value={cronFields.month}
            label="Month"
            onChange={(e) => onFieldChange('month', e.target.value)}
          >
            {MONTH_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Day of Week</InputLabel>
          <Select
            value={cronFields.dayOfWeek}
            label="Day of Week"
            onChange={(e) => onFieldChange('dayOfWeek', e.target.value)}
          >
            {DAY_OF_WEEK_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  )
}

export default CronBuilder 