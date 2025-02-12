import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Select, MenuItem, FormControl, InputLabel, Grid, Paper } from '@mui/material';
import { TemperatureHumidityChart } from '../TemperatureHumidityChart'
import { WindSpeedChart } from '../WindSpeedChart'
import { TemperatureData, loadTemperatureData } from '../../utils/csvLoader';
import { WindData, loadWindData } from '../../utils/csvLoader';

export const Visualizations: React.FC = () => {
  const [tempData, setTempData] = useState<TemperatureData[]>([]);
  const [windData, setWindData] = useState<WindData[]>([]);
  const [error, setError] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tempDataResult, windDataResult] = await Promise.all([
          loadTemperatureData(),
          loadWindData()
        ]);
        
        setTempData(tempDataResult);
        setWindData(windDataResult);
        
        // Extract unique years from the temperature data
        const currentYear = new Date().getFullYear();
        const years = [...new Set(tempDataResult.map(d => new Date(d.date).getFullYear()))]
          .filter(year => year >= 2000 && year <= currentYear);
        setAvailableYears(years.sort((a, b) => b - a));
        
        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      } catch (err) {
        setError('Error loading data');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Filter data for selected year
  const yearTempData = tempData
    .filter(d => new Date(d.date).getFullYear() === selectedYear)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const yearWindData = windData
    .filter(d => new Date(d.date).getFullYear() === selectedYear)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {availableYears.map((year) => (
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
            <Paper elevation={3} sx={{ p: 3, minHeight: 500 }}>
              <Typography variant="h6">
                Top Right Container
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, minHeight: 500 }}>
              <Typography variant="h6">
                Bottom Left Container
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, minHeight: 500 }}>
              <Typography variant="h6">
                Bottom Right Container
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}