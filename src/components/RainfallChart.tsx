/**
 * @fileoverview Stacked bar chart showing monthly rainfall distribution by type
 * using MUI X Charts.
 */

import { BarChart } from '@mui/x-charts'
import { Paper, Stack, Typography, Box } from '@mui/material'
import { RainData } from '../utils/csvLoader'

interface Props {
  data: RainData[]
}

interface MonthlyData {
  month: string
  Dry: number
  '<2mm': number
  '2-5mm': number
  '5-10mm': number
  '10-20mm': number
  '>20mm': number
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
        }}
      />
      <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
        {label}
      </Typography>
    </Stack>
  )
}

export function RainfallChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, height: 500 }}>
        <Typography>No data available</Typography>
      </Paper>
    )
  }

  const RAIN_TYPES = [
    'Dry',
    '<2mm',
    '2-5mm',
    '5-10mm',
    '10-20mm',
    '>20mm',
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
      Dry: 0,
      '<2mm': 0,
      '2-5mm': 0,
      '5-10mm': 0,
      '10-20mm': 0,
      '>20mm': 0,
    }
  }

  // Process data to get monthly counts by type
  const monthlyData = data.reduce((acc, entry) => {
    const date = new Date(entry.date)
    const month = date.getMonth()

    // Clean the type string by removing carriage returns and whitespace
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
    Dry: '#a5d6a7',
    '<2mm': '#bbdefb',
    '2-5mm': '#64b5f6',
    '5-10mm': '#2196f3',
    '10-20mm': '#1976d2',
    '>20mm': '#0d47a1',
  }

  return (
    <Paper elevation={3} sx={{ p: 3, height: 500 }}>
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
        height={350}
        margin={{ top: 20, bottom: 50, left: 40, right: 10 }}
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
          mt: 2,
          '& > *': {
            flex: {
              xs: '0 0 calc(33% - 16px)',
              sm: '0 0 auto',
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
    </Paper>
  )
}
