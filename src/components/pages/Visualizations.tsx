import React, { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material'
import { TemperatureHumidityChart } from '../TemperatureHumidityChart'
import { WindSpeedChart } from '../WindSpeedChart'
import { TemperatureData, loadTemperatureData } from '../../utils/csvLoader'
import { WindData, loadWindData } from '../../utils/csvLoader'
import { RainfallChart } from '../RainfallChart'
import { RainData, loadRainData } from '../../utils/csvLoader'
import { WindRoseData, loadWindRoseData } from '../../utils/csvLoader'
import { WindRoseChart } from '../WindRoseChart'

export const Visualizations: React.FC = () => {
  const [tempData, setTempData] = useState<TemperatureData[]>([])
  const [windData, setWindData] = useState<WindData[]>([])
  const [rainData, setRainData] = useState<RainData[]>([])
  const [windRoseData, setWindRoseData] = useState<WindRoseData[]>([])
  const [error, setError] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [availableYears, setAvailableYears] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tempDataResult, windDataResult, rainDataResult, windRoseResult] =
          await Promise.all([
            loadTemperatureData(),
            loadWindData(),
            loadRainData(),
            loadWindRoseData(),
          ])

        setTempData(tempDataResult || [])
        setWindData(windDataResult || [])
        setRainData(rainDataResult || [])

        // Ensure wind rose data is properly formatted
        const formattedWindRoseData = windRoseResult
          .filter(
            d => d && d.direction && !isNaN(d.speed) && !isNaN(d.frequency)
          )
          .map(d => ({
            direction: d.direction,
            speed: Number(d.speed),
            frequency: Number(d.frequency),
          }))

        setWindRoseData(formattedWindRoseData)

        if (tempDataResult && tempDataResult.length > 0) {
          // Extract year from date string if year property doesn't exist
          const years = Array.from(
            new Set(
              tempDataResult
                .filter(d => d?.date) // Filter items with date
                .map(d => {
                  const date = new Date(d.date)
                  return date.getFullYear().toString()
                })
            )
          )

          if (years.length > 0) {
            const sortedYears = years.sort((a, b) => b.localeCompare(a))
            setSelectedYear(sortedYears[0])
            setAvailableYears(sortedYears)
          } else {
            setError('No valid years found in the data')
          }
        } else {
          setError('No temperature data available')
        }
      } catch (err) {
        setError(
          `Error loading data: ${err instanceof Error ? err.message : String(err)}`
        )
        console.error('Data loading error:', err)
      }
    }

    fetchData()
  }, [])

  // Filter data for selected year
  const yearTempData = tempData
    .filter(d => {
      const dataYear = new Date(d.date).getFullYear().toString()
      return dataYear === selectedYear
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const yearWindData = windData
    .filter(d => {
      const dataYear = new Date(d.date).getFullYear().toString()
      return dataYear === selectedYear
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const yearRainData = rainData
    .filter(d => {
      const dataYear = new Date(d.date).getFullYear().toString()
      return dataYear === selectedYear
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Temperature and Humidity Visualizations
        </Typography>

        <FormControl sx={{ mb: 4, minWidth: 120 }}>
          <InputLabel id="year-select-label">Year</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={selectedYear}
            label="Year"
            onChange={e => setSelectedYear(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            {availableYears.map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TemperatureHumidityChart data={yearTempData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <WindSpeedChart data={yearWindData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <WindRoseChart data={windRoseData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <RainfallChart data={yearRainData} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
