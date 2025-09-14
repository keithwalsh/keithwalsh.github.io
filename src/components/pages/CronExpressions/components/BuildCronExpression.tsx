import React from 'react'
import { Paper, Stack, Box } from '@mui/material'
import { LinSelect, LinSubHeader } from '../../../shared-components'
import type { CronField } from '../types/cron'
import { 
  MINUTE_OPTIONS, 
  HOUR_OPTIONS, 
  DAY_OPTIONS, 
  MONTH_OPTIONS, 
  DAY_OF_WEEK_OPTIONS 
} from '../constants/cronOptions'

interface BuildCronExpressionProps {
  cronFields: CronField
  onFieldChange: (field: keyof CronField, value: string) => void
}

const BuildCronExpression: React.FC<BuildCronExpressionProps> = ({
  cronFields,
  onFieldChange
}) => {

  return (
    <Paper
      elevation={0}
      sx={{ 
        px: 0, 
        maxWidth: { xs: '480px', sm: '480px', md: '1000px', lg: '1000px', xl: '1000px' },
      }}
      >
      <LinSubHeader title="Build Cron Expression" />
      
      <Box
        sx={{
          mx: { xs: 1, sm: 3, md: 3, lg: 3, xl: 3 },
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2, sm: 2, md: 2, lg: 3, xl: 5 }}
          sx={{
            maxWidth: { xs: '200px', sm: '200px', md: '750px', lg: '750px', xl: '750px' },
            mx: { xs: 'auto', sm: 'auto', md: '0', lg: '0', xl: '0' },
            alignItems: { xs: 'center', sm: 'center', md: 'left', lg: 'left', xl: 'left' },
            justifyContent: { xs: 'center', sm: 'center', md: 'left', lg: 'left', xl: 'left' },
          }}
        >
          <LinSelect
            selectedValue={cronFields.minutes}
            label="Minutes"
            values={MINUTE_OPTIONS}
            onChange={(e) => onFieldChange('minutes', e as string)}
          />

          <LinSelect
            selectedValue={cronFields.hours}
            label="Hours"
            values={HOUR_OPTIONS}
            onChange={(e) => onFieldChange('hours', e as string)}
          />

          <LinSelect
            selectedValue={cronFields.dayOfMonth}
            label="Day of Month"
            values={DAY_OPTIONS}
            onChange={(e) => onFieldChange('dayOfMonth', e as string)}
          />

          <LinSelect
            selectedValue={cronFields.month}
            label="Month"
            values={MONTH_OPTIONS}
            onChange={(e) => onFieldChange('month', e as string)}
          />

          <LinSelect
            selectedValue={cronFields.dayOfWeek}
            label="Day of Week"
            values={DAY_OF_WEEK_OPTIONS}
            onChange={(e) => onFieldChange('dayOfWeek', e as string)}
          />
        </Stack>
      </Box>
    </Paper>
  )
}

export default BuildCronExpression 