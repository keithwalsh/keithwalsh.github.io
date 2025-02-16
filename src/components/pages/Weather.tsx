import React, { useEffect, useState } from 'react'
import { Container, Typography, Box, Fab, Menu, MenuItem } from '@mui/material'
import { TemperatureHumidityChart } from '../TemperatureHumidityChart'
import { WindSpeedChart } from '../WindSpeedChart'
import { TemperatureData, loadTemperatureData } from '../../utils/csvLoader'
import { WindData, loadWindData } from '../../utils/csvLoader'
import { RainfallChart } from '../RainfallChart'
import { RainData, loadRainData } from '../../utils/csvLoader'
import { WindRoseData, loadWindRoseData } from '../../utils/csvLoader'
import { WindRoseChart } from '../WindRoseChart'
import { Masonry } from '@mui/lab'
import FilterAltIcon from '@mui/icons-material/FilterAlt'

export const Weather: React.FC = () => {
  const [tempData, setTempData] = useState<TemperatureData[]>([])
  const [windData, setWindData] = useState<WindData[]>([])
  const [rainData, setRainData] = useState<RainData[]>([])
  const [windRoseData, setWindRoseData] = useState<WindRoseData[]>([])
  const [error, setError] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [availableYears, setAvailableYears] = useState<string[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)

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

  useEffect(() => {
    const mainElement = document.querySelector('main')
    if (!mainElement) return

    const handleScroll = () => {
      const scrollPosition = mainElement.scrollTop
      setIsScrolled(scrollPosition > 20)
    }

    mainElement.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => mainElement.removeEventListener('scroll', handleScroll)
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

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleYearSelect = (year: string) => {
    setSelectedYear(year)
    handleClose()
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4, minHeight: '200vh' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Weather Visualizations
        </Typography>

        <Typography variant="body1" sx={{ mb: 8, maxWidth: '800px' }}>
          The below data was recorded from the Claremorris Met Éireann
          meteorological station, situated about 2 Km south of the centre of the
          town (my home town), in county Mayo, Ireland. The weather data is
          updated monthly.
        </Typography>

        <Box
          sx={{
            position: 'fixed',
            top: 240,
            left: 290,
            transform: isScrolled
              ? 'translate(calc(100vw - 460px), calc(100vh - 315px))'
              : 'none',
            zIndex: 1200,
            transition: 'all 0.3s ease',
          }}
        >
          <Fab
            color="primary"
            aria-label="change year"
            onClick={handleClick}
            variant="extended"
            size="small"
          >
            <FilterAltIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Box component="span" sx={{ fontSize: '12px', fontWeight: 500 }}>
              Year:{' '}
              <Box component="span" sx={{ fontSize: '12px', fontWeight: 300 }}>
                {selectedYear}
              </Box>
            </Box>
          </Fab>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {availableYears.map(year => (
              <MenuItem
                key={year}
                onClick={() => handleYearSelect(year)}
                selected={year === selectedYear}
              >
                {year}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Masonry columns={{ xs: 1, sm: 2 }} spacing={3} sx={{ mt: 3 }}>
          <Box>
            <TemperatureHumidityChart data={yearTempData} />
          </Box>
          <Box>
            <WindSpeedChart data={yearWindData} />
          </Box>
          <Box>
            <WindRoseChart data={windRoseData} />
          </Box>
          <Box>
            <RainfallChart data={yearRainData} />
          </Box>
        </Masonry>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 4, textAlign: 'center' }}
        >
          Weather data provided by Met Éireann under the&nbsp;
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Creative Commons Attribution 4.0 International License
          </a>
        </Typography>
      </Box>
    </Container>
  )
}
