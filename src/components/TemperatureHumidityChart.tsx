/**
 * @fileoverview Chart component displaying temperature and humidity data over time
 * using MUI X-Charts LineChart with dual axes.
 */

import { Box, Typography, Paper, Stack, Slider } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { TemperatureData } from '../utils/csvLoader'
import React from 'react'

interface TemperatureHumidityChartProps {
  data: TemperatureData[]
}

interface LegendItemProps {
  color: string
  label: string
  dashArray?: string
}

function LegendItem({ color, label, dashArray }: LegendItemProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {color === 'area' ? (
        <Box
          sx={{
            width: 10,
            height: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#ff5722',
            opacity: 0.3,
          }}
        />
      ) : (
        <Box
          component="svg"
          sx={{
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <line
            x1="0"
            y1="10"
            x2="20"
            y2="10"
            stroke={color}
            strokeWidth={3}
            strokeDasharray={dashArray}
          />
        </Box>
      )}
      <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
        {label}
      </Typography>
    </Stack>
  )
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
    <Paper elevation={3} sx={{ pt: 3, pb: 0, px: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        <Typography variant="h6">Temperature and Humidity</Typography>
      </Typography>
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
              height={310}
              margin={{ left: 50, right: 50, top: 30, bottom: 50 }}
              slotProps={{
                legend: {
                  hidden: true,
                },
              }}
            />
          </Box>

          {/* Custom Legend */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
            sx={{
              mt: 1,
              mb: 1,
              '& > *': {
                flex: {
                  xs: '0 0 calc(50% - 16px)',
                  sm: '0 0 auto',
                },
                textAlign: 'left',
                mb: { xs: 1, sm: 0 },
              },
            }}
          >
            <LegendItem color="#ff5722" label="Mean Temperature" />
            <LegendItem color="area" label="Max/Min Temperature" />
            <LegendItem color="#2196f3" label="Relative Humidity" />
          </Stack>

          {/* Date Range Zoom with Label */}
          <Box sx={{ px: 2, pb: 1, mt: 2 }}>
            <Typography
              variant="caption"
              sx={{ mb: -1, display: 'block', textAlign: 'center' }}
            >
              Date Range Zoom
            </Typography>
            <Box sx={{ width: '80%', mx: 'auto' }}>
              <Slider
                value={visibleRange}
                onChange={(_, newValue) =>
                  setVisibleRange(newValue as number[])
                }
                valueLabelDisplay="auto"
                valueLabelFormat={getDateLabel}
                componentsProps={{
                  valueLabel: {
                    style: {
                      zIndex: 2000,
                      transform: 'translateY(-25px)',
                      ...{
                        '[data-index="1"]': {
                          transform: 'translateY(-25px) translateX(-100%)',
                        },
                      },
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  )
}
