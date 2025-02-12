import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { TemperatureData, loadTemperatureData } from '../../utils/csvLoader';

export const Visualizations: React.FC = () => {
  const [data, setData] = useState<TemperatureData[]>([]);
  const [error, setError] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tempData = await loadTemperatureData();
        setData(tempData);
        
        // Extract unique years from the data and filter out invalid years
        const currentYear = new Date().getFullYear();
        const years = [...new Set(tempData.map(d => new Date(d.date).getFullYear()))]
          .filter(year => year >= 2000 && year <= currentYear); // Adjust the start year as needed
        setAvailableYears(years.sort((a, b) => b - a)); // Sort descending
        
        // Set the most recent year as default
        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      } catch (err) {
        setError('Error loading temperature data');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Filter data for selected year and sort chronologically
  const yearData = data
    .filter(d => new Date(d.date).getFullYear() === selectedYear)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort chronologically

  return (
    <Container maxWidth="lg">
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
        
        {yearData.length > 0 && (
          <Box sx={{ width: '100%', height: 400, mt: 4 }}>
            <LineChart
              sx={{
                '& .MuiAreaElement-series-max': {
                  fill: "#FFB399",
                },
                '& .MuiAreaElement-series-min': {
                  fill: theme => theme.palette.mode === 'light' ? '#ffffff' : '#121212',
                },
                '& .MuiChartsAxis-left .MuiChartsAxis-label': {
                  fill: '#FF5733',
                },
                '& .MuiChartsAxis-right .MuiChartsAxis-label': {
                  fill: '#1E90FF',
                },
              }}
              series={[
                {
                  data: yearData.map(d => d.max_temp),
                  id: 'max',
                  label: 'Max Temperature (°C)',
                  showMark: false,
                  color: 'transparent',
                  area: true,
                  baseline: 'min',
                  valueFormatter: (value) => `${value}°C`,
                  yAxisId: 'left',
                },
                {
                  data: yearData.map(d => d.mean_temp),
                  id: 'mean',
                  label: 'Mean Temperature (°C)',
                  color: '#FF5733',
                  showMark: false,
                  yAxisId: 'left',
                },
                {
                  data: yearData.map(d => d.min_temp),
                  id: 'min',
                  label: 'Min Temperature (°C)',
                  showMark: false,
                  color: 'transparent',
                  area: true,
                  baseline: 'min',
                  valueFormatter: (value) => `${value}°C`,
                  yAxisId: 'left',
                },
                {
                  data: yearData.map(d => d.rel_humidity),
                  id: 'humidity',
                  label: 'Relative Humidity (%)',
                  color: '#1E90FF',
                  showMark: false,
                  yAxisId: 'right',
                  valueFormatter: (value) => `${value}%`,
                }
              ]}
              xAxis={[{
                data: yearData.map(d => new Date(d.date).toLocaleDateString()),
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
              margin={{ left: 70, right: 70, top: 50, bottom: 50 }}
              slotProps={{
                legend: {
                  hidden: true,
                },
              }}
            />
          </Box>
        )}
        
        <Typography variant="body1" sx={{ mt: 4 }}>
          This chart shows temperature and humidity trends over the last 30 days. The left axis displays temperature (°C), while the right axis shows relative humidity (%).
        </Typography>
      </Box>
    </Container>
  );
};
