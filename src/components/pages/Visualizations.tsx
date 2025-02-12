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
          Temperature Visualizations
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        
        {data.length > 0 && (
          <Box sx={{ width: '100%', height: 400, mt: 4 }}>
            <LineChart
              series={[
                {
                  data: recentData.map(d => d.max_temp),
                  label: 'Max Temperature (°C)',
                  color: '#e57373',
                },
                {
                  data: recentData.map(d => d.min_temp),
                  label: 'Min Temperature (°C)',
                  color: '#64b5f6',
                },
                {
                  data: recentData.map(d => d.mean_temp),
                  label: 'Mean Temperature (°C)',
                  color: '#81c784',
                }
              ]}
              xAxis={[{
                data: recentData.map(d => new Date(d.date).toLocaleDateString()),
                scaleType: 'band',
              }]}
              height={300}
              margin={{ left: 70, right: 30, top: 50, bottom: 50 }}
            />
          </Box>
        )}
        
        <Typography variant="body1" sx={{ mt: 4 }}>
          This chart shows the temperature trends over the last 30 days, displaying maximum, minimum, and mean temperatures.
        </Typography>
      </Box>
    </Container>
  );
};
