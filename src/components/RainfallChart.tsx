/**
 * @fileoverview Stacked bar chart showing monthly rainfall distribution by type
 * using MUI X Charts.
 */

import { BarChart } from '@mui/x-charts'
import { Paper, Stack, Typography, Box } from '@mui/material'
import { RainData } from '../utils/csvLoader'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import { styled } from '@mui/material/styles'
import React from 'react'

interface Props {
  data: RainData[]
}

interface MonthlyData {
  month: string
  'Dry (<0.2mm)': number
  '0.2mm-1mm': number
  '1-5mm': number
  '5-15mm': number
  '15-25mm': number
  '>25mm': number
}

// Add LegendItem component
interface LegendItemProps {
  color: string
  label: string
}

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box
        sx={{
          width: 10,
          height: 10,
          bgcolor: color,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
      <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
        {label}
      </Typography>
    </Stack>
  )
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: 'rotate(90deg)',
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255, 255, 255, .05)',
  }),
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}))

export function RainfallChart({ data }: Props) {
  const [expanded, setExpanded] = React.useState<string | false>(false)

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
    }

  if (!data || data.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, height: 500 }}>
        <Typography>No data available</Typography>
      </Paper>
    )
  }

  const RAIN_TYPES = [
    'Dry (<0.2mm)',
    '0.2mm-1mm',
    '1-5mm',
    '5-15mm',
    '15-25mm',
    '>25mm',
  ] as const

  type RainType = (typeof RAIN_TYPES)[number]

  // Initialize all months
  const initialMonthlyData: Record<number, MonthlyData> = {}
  for (let i = 0; i < 12; i++) {
    const monthName = new Date(2024, i, 1).toLocaleString('default', {
      month: 'short',
    })
    initialMonthlyData[i] = {
      month: monthName,
      'Dry (<0.2mm)': 0,
      '0.2mm-1mm': 0,
      '1-5mm': 0,
      '5-15mm': 0,
      '15-25mm': 0,
      '>25mm': 0,
    }
  }

  // Process data to get monthly counts by type
  const monthlyData = data.reduce((acc, entry) => {
    const date = new Date(entry.date)
    const month = date.getMonth()
    const cleanType = entry.rainfall_bucket.trim()

    if (RAIN_TYPES.includes(cleanType as RainType)) {
      acc[month][cleanType as RainType]++
    } else {
      console.warn(
        `Invalid rain type: "${cleanType}" (original: "${entry.rainfall_bucket}")`
      )
    }

    return acc
  }, initialMonthlyData)

  const chartData = Object.values(monthlyData)
  const months = chartData.map(item => item.month)

  const COLORS = {
    'Dry (<0.2mm)': '#a5d6a7',
    '0.2mm-1mm': '#bbdefb',
    '1-5mm': '#64b5f6',
    '5-15mm': '#2196f3',
    '15-25mm': '#1976d2',
    '>25mm': '#0d47a1',
  }

  return (
    <Paper
      elevation={3}
      sx={{
        pt: 3,
        pb: 0,
        px: 3,
        height: '100%',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Monthly Rainfall Distribution
      </Typography>
      <BarChart
        series={RAIN_TYPES.map(type => ({
          data: chartData.map(
            item => item[type as keyof MonthlyData] as number
          ),
          label: type,
          stack: 'total',
          color: COLORS[type as keyof typeof COLORS],
        }))}
        xAxis={[
          {
            data: months,
            scaleType: 'band',
          },
        ]}
        yAxis={[
          {
            label: 'Days',
            max: 31,
            scaleType: 'linear',
          },
        ]}
        height={310}
        margin={{ left: 50, right: 30, top: 30, bottom: 50 }}
        slotProps={{
          legend: {
            hidden: true,
          },
        }}
      />

      {/* Custom Legend */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        flexWrap="wrap"
        sx={{
          mt: { xs: 2, md: 2, lg: 2, xl: 2 },
          mb: { xs: 6.75, xl: 6.75 },
          '& > *': {
            flex: {
              xs: '0 0 calc(50% - 16px)', // e.g. 2x2 on small screens
              sm: '0 0 auto', // e.g. 1x4 on larger screens
            },
            textAlign: 'left',
            mb: { xs: 1, sm: 0 },
          },
        }}
      >
        {RAIN_TYPES.map(type => (
          <LegendItem
            key={type}
            color={COLORS[type as keyof typeof COLORS]}
            label={type}
          />
        ))}
      </Stack>

      <Box sx={{ mt: 'auto', mb: 2 }}>
        <Accordion
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
        >
          <AccordionSummary
            aria-controls="rainfall-content"
            id="rainfall-header"
          >
            <Typography component="span" variant="body2">
              Learn More
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph variant="body2">
              Ireland's rainfall patterns are characterized by their frequency
              rather than intensity. The country experiences rain on many days
              throughout the year, but the amount of rainfall per day is
              typically moderate to light.
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Understanding Rainfall Categories
            </Typography>
            <Typography paragraph variant="body2">
              The rainfall categories shown in this chart help understand the
              distribution of daily rainfall amounts:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 2 }}>
              <Typography component="li" variant="body2">
                Dry days ({'<'}0.2mm): Days with negligible rainfall
              </Typography>
              <Typography component="li" variant="body2">
                Very light (0.2-1mm): Drizzle or misty conditions
              </Typography>
              <Typography component="li" variant="body2">
                Light rain (1-5mm): Common occurrence
              </Typography>
              <Typography component="li" variant="body2">
                Moderate rain (5-15mm): Regular rainfall events
              </Typography>
              <Typography component="li" variant="body2">
                Heavy rain (15-25mm): Significant rainfall events
              </Typography>
              <Typography component="li" variant="body2">
                Very heavy rain ({'>'}25mm): Extreme rainfall events
              </Typography>
            </Box>
            <Typography variant="subtitle2" gutterBottom>
              Impact on Environment
            </Typography>
            <Typography variant="body2">
              This rainfall pattern is crucial for Ireland's ecosystem,
              supporting the country's famous green landscape and agricultural
              activities. The consistent distribution of rainfall throughout the
              year, rather than concentrated wet seasons, helps maintain stable
              soil moisture levels and supports sustainable farming practices.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Paper>
  )
}
