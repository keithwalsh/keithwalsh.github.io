/**
 * @fileoverview Chart component displaying various wind speed measurements over time
 * using MUI X-Charts LineChart.
 */

import { Box, Typography, Paper } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { WindData } from '../utils/csvLoader'

interface WindSpeedChartProps {
  data: WindData[]
}

export function WindSpeedChart({ data }: WindSpeedChartProps) {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Wind Speed Measurements
      </Typography>
      {data.length > 0 && (
        <Box sx={{ width: '100%', height: 300 }}>
          <LineChart
            sx={{
                '& .MuiAreaElement-series-max': {
                  fill: "#00acc1",
                  fillOpacity: 0.3,
                },
                '& .MuiAreaElement-series-min': {
                  fill: theme => theme.palette.mode === 'light' ? '#ffffff' : '#252525',
                },
              }}
            series={[
              {
                data: data.map(d => d.high_ten_min_mean_wind_speed_kph),
                id: 'ten-min',
                label: 'Max. 10-min Mean (km/h)',
                color: '#9e9e9e',
                valueFormatter: (value) => `${value} km/h`,
                showMark: false,
              },
              {
                data: data.map(d => d.max_hourly_mean_wind_speed_kph),
                id: 'max',
                label: 'Max. Hourly Mean',
                color: 'transparent',
                area: true,
                baseline: 'min',
                valueFormatter: (value) => `${value} km/h`,
                showMark: false,
              },
              {
                data: data.map(d => d.mean_wind_speed_kph),
                id: 'mean',
                label: 'Mean Wind Speed',
                color: '#00acc1',
                valueFormatter: (value) => `${value} km/h`,
                showMark: false,
              },
              {
                data: data.map(d => d.min_hourly_mean_wind_speed_kph),
                id: 'min',
                label: 'Min. Hourly Mean',
                color: 'transparent',
                area: true,
                baseline: 'min',
                valueFormatter: (value) => `${value} km/h`,
                showMark: false,
              }
            ]}
            xAxis={[{
              data: data.map(d => new Date(d.date).toLocaleDateString()),
              scaleType: 'band',
            }]}
            yAxis={[{ 
              id: 'left',
              label: 'Wind Speed (km/h)',
            }]}
            height={300}
            margin={{ left: 70, right: 20, top: 30, bottom: 30 }}
            slotProps={{
              legend: {
                hidden: true,
              },
            }}
          />
        </Box>
      )}
    </Paper>
  )
} 