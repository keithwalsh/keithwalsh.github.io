/**
 * @fileoverview Chart component displaying temperature and humidity data over time
 * using MUI X-Charts LineChart with dual axes.
 */

import { Box, Typography, Paper, Stack, Slider } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { TemperatureData } from '../utils/csvLoader'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import React from 'react'

interface TemperatureHumidityChartProps {
  data: TemperatureData[]
}

export function TemperatureHumidityChart({
  data,
}: TemperatureHumidityChartProps) {
  // Add state for controlling visible range
  const [visibleRange, setVisibleRange] = React.useState<number[]>([0, 100])

  // Format date for tooltip with better bounds checking
  const getDateLabel = React.useCallback(
    (value: number) => {
      const index = Math.min(
        Math.floor((data.length * value) / 100),
        data.length - 1 // Ensure we never exceed the last index
      )
      if (index >= 0 && index < data.length) {
        const date = new Date(data[index].date)
        return date.toLocaleDateString()
      }
      return ''
    },
    [data]
  )

  // Calculate visible data with sampling for x-axis labels
  const visibleData = React.useMemo(() => {
    const start = Math.floor((data.length * visibleRange[0]) / 100)
    const end = Math.min(
      Math.ceil((data.length * visibleRange[1]) / 100),
      data.length
    )
    return data.slice(start, end)
  }, [data, visibleRange])

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <ThermostatIcon />
        <Typography variant="h6">Temperature and Humidity</Typography>
      </Stack>
      {data.length > 0 && (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ height: 300 }}>
            <LineChart
              sx={{
                '& .MuiAreaElement-series-max': {
                  fill: '#ff5722',
                  fillOpacity: 0.3,
                },
                '& .MuiAreaElement-series-min': {
                  fill: theme =>
                    theme.palette.mode === 'light' ? '#ffffff' : '#252525',
                },
                '& .MuiChartsAxis-left .MuiChartsAxis-label': {
                  fill: '#ff5722',
                },
                '& .MuiChartsAxis-right .MuiChartsAxis-label': {
                  fill: '#2196f3',
                },
              }}
              series={[
                {
                  data: visibleData.map(d => d.max_temp),
                  id: 'max',
                  label: 'Max. Temperature (°C)',
                  showMark: false,
                  color: 'transparent',
                  area: true,
                  baseline: 'min',
                  valueFormatter: value => `${value}°C`,
                  yAxisId: 'left',
                },
                {
                  data: visibleData.map(d => d.mean_temp),
                  id: 'mean',
                  label: 'Mean Temperature (°C)',
                  color: '#ff5722',
                  showMark: false,
                  yAxisId: 'left',
                },
                {
                  data: visibleData.map(d => d.min_temp),
                  id: 'min',
                  label: 'Min. Temperature (°C)',
                  showMark: false,
                  color: 'transparent',
                  area: true,
                  baseline: 'min',
                  valueFormatter: value => `${value}°C`,
                  yAxisId: 'left',
                },
                {
                  data: visibleData.map(d => d.rel_humidity),
                  id: 'humidity',
                  label: 'Relative Humidity (%)',
                  color: '#2196f3',
                  showMark: false,
                  yAxisId: 'right',
                  valueFormatter: value => `${value}%`,
                },
              ]}
              xAxis={[
                {
                  data: visibleData.map(d =>
                    new Date(d.date).toLocaleDateString()
                  ),
                  scaleType: 'band',
                },
              ]}
              yAxis={[
                {
                  id: 'left',
                  label: 'Temperature (°C)',
                  min: -10,
                  max: 30,
                },
                {
                  id: 'right',
                  label: 'Relative Humidity (%)',
                  min: 0,
                  max: 100,
                },
              ]}
              rightAxis="right"
              height={300}
              margin={{ left: 50, right: 50, top: 30, bottom: 30 }}
              slotProps={{
                legend: {
                  hidden: true,
                },
              }}
            />
          </Box>

          {/* Add slider control */}
          <Box
            sx={{
              px: 2,
              pb: 1,
              mt: 2,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ width: '80%' }}>
              <Slider
                value={visibleRange}
                onChange={(_, newValue) =>
                  setVisibleRange(newValue as number[])
                }
                valueLabelDisplay="auto"
                valueLabelFormat={getDateLabel}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  )
}
