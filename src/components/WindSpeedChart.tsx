/**
 * @fileoverview Chart component displaying various wind speed measurements over time
 * using MUI X-Charts LineChart.
 */

import { Box, Typography, Paper } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { WindData } from '../utils/csvLoader'
import React from 'react'
import { Slider } from '@mui/material'

interface WindSpeedChartProps {
  data: WindData[]
}

export function WindSpeedChart({ data }: WindSpeedChartProps) {
  const [visibleRange, setVisibleRange] = React.useState<number[]>([0, 100])

  // Format date for tooltip with bounds checking
  const getDateLabel = React.useCallback(
    (value: number) => {
      const index = Math.min(
        Math.floor((data.length * value) / 100),
        data.length - 1
      )
      if (index >= 0 && index < data.length) {
        const date = new Date(data[index].date)
        return date.toLocaleDateString()
      }
      return ''
    },
    [data]
  )

  // Calculate visible data with bounds checking
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
      <Typography variant="h6" gutterBottom>
        Wind Speed Measurements
      </Typography>
      {data.length > 0 && (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ height: 300 }}>
            <LineChart
              sx={{
                '& .MuiAreaElement-series-max': {
                  fill: '#00acc1',
                  fillOpacity: 0.3,
                },
                '& .MuiAreaElement-series-min': {
                  fill: theme =>
                    theme.palette.mode === 'light' ? '#ffffff' : '#252525',
                },
                '& .MuiLineElement-series-ten-min': {
                  strokeDasharray: '5 5',
                },
                '& .MuiLineElement-series-gust': {
                  strokeDasharray: '1 3',
                },
              }}
              series={[
                {
                  data: visibleData.map(d => d.highest_gust_speed_kph),
                  id: 'gust',
                  label: 'Max. Gust',
                  color: '#9e9e9e',
                  valueFormatter: value => `${value} km/h`,
                  showMark: false,
                },
                {
                  data: visibleData.map(
                    d => d.high_ten_min_mean_wind_speed_kph
                  ),
                  id: 'ten-min',
                  label: 'Max. 10-min Mean',
                  color: '#009688',
                  valueFormatter: value => `${value} km/h`,
                  showMark: false,
                },
                {
                  data: visibleData.map(d => d.max_hourly_mean_wind_speed_kph),
                  id: 'max',
                  label: 'Max. Hourly Mean',
                  color: 'transparent',
                  area: true,
                  baseline: 'min',
                  valueFormatter: value => `${value} km/h`,
                  showMark: false,
                },
                {
                  data: visibleData.map(d => d.mean_wind_speed_kph),
                  id: 'mean',
                  label: 'Mean Wind Speed',
                  color: '#00acc1',
                  valueFormatter: value => `${value} km/h`,
                  showMark: false,
                },
                {
                  data: visibleData.map(d => d.min_hourly_mean_wind_speed_kph),
                  id: 'min',
                  label: 'Min. Hourly Mean',
                  color: 'transparent',
                  area: true,
                  baseline: 'min',
                  valueFormatter: value => `${value} km/h`,
                  showMark: false,
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
                  label: 'Wind Speed (km/h)',
                },
              ]}
              height={300}
              margin={{ left: 70, right: 20, top: 30, bottom: 30 }}
              slotProps={{
                legend: {
                  hidden: true,
                },
              }}
            />
          </Box>
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
