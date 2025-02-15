/**
 * @fileoverview Chart component displaying various wind speed measurements over time
 * using MUI X-Charts LineChart.
 */

import { Box, Typography, Paper, Stack } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { WindData } from '../utils/csvLoader'
import React from 'react'
import { Slider } from '@mui/material'

interface WindSpeedChartProps {
  data: WindData[]
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
            bgcolor: '#00acc1',
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
      <Typography variant="caption" sx={{ fontSize: '0.69rem' }}>
        {label}
      </Typography>
    </Stack>
  )
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
    <Paper elevation={3} sx={{ pt: 3, pb: 0, px: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Wind Speed Measurements
      </Typography>
      {data.length > 0 && (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ height: '100%' }}>
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
              height={310}
              margin={{ left: 50, right: 30, top: 30, bottom: 50 }}
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
                  xs: '0 0 calc(50% - 16px)', // e.g. 2x2 on small screens
                  sm: '0 0 auto', // e.g. 1x4 on larger screens
                },
                textAlign: 'left',
                mb: { xs: 1, sm: 0 },
              },
            }}
          >
            <LegendItem color="#9e9e9e" label="Max. Gust" dashArray="1 2" />
            <LegendItem
              color="#009688"
              label="Max. 10-min Mean"
              dashArray="5 2"
            />
            <LegendItem color="#00acc1" label="Mean Wind Speed" />
            <LegendItem color="area" label="Max/Min Hourly Mean" />
          </Stack>
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
