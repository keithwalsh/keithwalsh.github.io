/**
 * @fileoverview Chart component displaying temperature and humidity data over time
 * using MUI X-Charts LineChart with dual axes.
 */

import { Box, Typography, Paper } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { TemperatureData } from '../utils/csvLoader'

interface TemperatureHumidityChartProps {
  data: TemperatureData[]
}

export function TemperatureHumidityChart({ data }: TemperatureHumidityChartProps) {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Temperature and Humidity Trends
      </Typography>
      {data.length > 0 && (
        <Box sx={{ width: '100%', height: 300 }}>
          <LineChart
            sx={{
              '& .MuiAreaElement-series-max': {
                fill: "#ffb199",
              },
              '& .MuiAreaElement-series-min': {
                fill: theme => theme.palette.mode === 'light' ? '#ffffff' : '#252525',
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
                data: data.map(d => d.max_temp),
                id: 'max',
                label: 'Max. Temperature (°C)',
                showMark: false,
                color: 'transparent',
                area: true,
                baseline: 'min',
                valueFormatter: (value) => `${value}°C`,
                yAxisId: 'left',
              },
              {
                data: data.map(d => d.mean_temp),
                id: 'mean',
                label: 'Mean Temperature (°C)',
                color: '#ff5722',
                showMark: false,
                yAxisId: 'left',
              },
              {
                data: data.map(d => d.min_temp),
                id: 'min',
                label: 'Min. Temperature (°C)',
                showMark: false,
                color: 'transparent',
                area: true,
                baseline: 'min',
                valueFormatter: (value) => `${value}°C`,
                yAxisId: 'left',
              },
              {
                data: data.map(d => d.rel_humidity),
                id: 'humidity',
                label: 'Relative Humidity (%)',
                color: '#2196f3',
                showMark: false,
                yAxisId: 'right',
                valueFormatter: (value) => `${value}%`,
              }
            ]}
            xAxis={[{
              data: data.map(d => new Date(d.date).toLocaleDateString()),
              scaleType: 'band',
            }]}
            yAxis={[
              { 
                id: 'left',
                label: 'Temperature (°C)',
              },
              { 
                id: 'right',
                label: 'Relative Humidity (%)',
                min: 0,
                max: 100
              }
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
      )}
    </Paper>
  )
} 