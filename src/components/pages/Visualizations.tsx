import React, { useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { TemperatureData, loadTemperatureData } from '../../utils/csvLoader';

export const Visualizations: React.FC = () => {
  const [data, setData] = useState<TemperatureData[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tempData = await loadTemperatureData();
        setData(tempData);
      } catch (err) {
        setError('Error loading temperature data');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Get the last 30 days of data
  const recentData = data.slice(0, 30).reverse();
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Temperature and Humidity Visualizations
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        
        {data.length > 0 && (
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
                  data: recentData.map(d => d.rel_humidity),
                  id: 'humidity',
                  label: 'Relative Humidity (%)',
                  color: '#1E90FF',
                  yAxisId: 'right',
                  valueFormatter: (value) => `${value}%`,
                },
                {
                  data: recentData.map(d => d.max_temp),
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
                  data: recentData.map(d => d.mean_temp),
                  id: 'mean',
                  label: 'Mean Temperature (°C)',
                  color: '#FF5733',
                  yAxisId: 'left',
                },
                {
                  data: recentData.map(d => d.min_temp),
                  id: 'min',
                  label: 'Min Temperature (°C)',
                  showMark: false,
                  color: 'transparent',
                  area: true,
                  baseline: 'min',
                  valueFormatter: (value) => `${value}°C`,
                  yAxisId: 'left',
                }
              ]}
              xAxis={[{
                data: recentData.map(d => new Date(d.date).toLocaleDateString()),
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
