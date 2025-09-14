import React from 'react'
import { Box, Card, CardActionArea, CardContent, Chip, Paper, Typography } from '@mui/material'
import type { CommonCronExpression } from '../types/cron'
import { LinSubHeader } from '../../../shared-components'

interface CommonExpressionsProps {
  onExpressionSelect: (expression: string) => void
}

const CommonExpressions: React.FC<CommonExpressionsProps> = ({
  onExpressionSelect,
}) => {
  const [selectedCard, setSelectedCard] = React.useState<number | null>(null)

  const commonExpressions: CommonCronExpression[] = [
    { name: 'Every minute', cron: '* * * * *', desc: 'Runs every minute' },
    {
      name: 'Every hour',
      cron: '0 * * * *',
      desc: 'Runs at the start of every hour',
    },
    {
      name: 'Daily at midnight',
      cron: '0 0 * * *',
      desc: 'Runs every day at 12:00 AM',
    },
    {
      name: 'Daily at 9 AM',
      cron: '0 9 * * *',
      desc: 'Runs every day at 9:00 AM',
    },
    {
      name: 'Weekly (Sunday)',
      cron: '0 0 * * 0',
      desc: 'Runs every Sunday at midnight',
    },
    {
      name: 'Monthly (1st)',
      cron: '0 0 1 * *',
      desc: 'Runs on the 1st of every month',
    },
    {
      name: 'Yearly (Jan 1st)',
      cron: '0 0 1 1 *',
      desc: 'Runs every year on January 1st',
    },
    {
      name: 'Weekdays at 9 AM',
      cron: '0 9 * * 1-5',
      desc: 'Runs Monday to Friday at 9:00 AM',
    },
  ]

  const handleCardClick = (index: number, expression: string) => {
    setSelectedCard(index)
    onExpressionSelect(expression)
  }

  return (
    <Paper
      elevation={0}
      sx={{ 
        px: 0, 
        maxWidth: '1000px'
      }}
      >
      <LinSubHeader title="Common Cron Expressions" />

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mx: { xs: 'auto', sm: 3, md: 3, lg: 3, xl: 3 },
          alignItems: { xs: 'center', sm: 'left', md: 'left', lg: 'left', xl: 'left' },
          justifyContent: { xs: 'center', sm: 'left', md: 'left', lg: 'left', xl: 'left' },
        }}
        >
        {commonExpressions.map((expr, index) => (
          <Card key={index}>
            <CardActionArea
              onClick={() => handleCardClick(index, expr.cron)}
              data-active={selectedCard === index ? '' : undefined}
              sx={{
                height: '100%',
                minWidth: { xs: 165, sm: 230, md: 230, lg: 230, xl: 230 },
                '&[data-active]': {
                  backgroundColor: 'action.selected',
                  '&:hover': {
                    backgroundColor: 'action.selectedHover',
                  },
                },
              }}
            >
              <CardContent sx={{ height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontSize: '0.9rem' }}>
                  {expr.name}
                </Typography>
                <Chip
                  label={expr.cron}
                  sx={{ fontFamily: 'monospace', mb: 1 }}
                />
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>
                    {expr.desc}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Paper>
  )
}

export default CommonExpressions
