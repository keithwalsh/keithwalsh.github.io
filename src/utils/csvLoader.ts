import Papa from 'papaparse';
import * as d3 from 'd3';

export interface TemperatureData {
  date: string;
  year: string;
  max_temp: number;
  min_temp: number;
  mean_temp: number;
  rel_humidity: number;
}

export interface WindData {
  date: string;
  year: string;
  mean_wind_speed_kph: number;
  max_hourly_mean_wind_speed_kph: number;
  min_hourly_mean_wind_speed_kph: number;
  high_ten_min_mean_wind_speed_kph: number;
  highest_gust_speed_kph: number;
}

export interface RainData {
  date: string;
  rain_amount_mm: number;
  rainfall_bucket: string;
}

export interface WindRoseData {
  direction: string;
  speed: number;
  frequency: number;
}

export async function loadTemperatureData(): Promise<TemperatureData[]> {
  try {
    const response = await fetch('/src/data/temperature.csv');
    const csvText = await response.text();
    
    const { data } = Papa.parse<TemperatureData>(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });

    return data.filter(row => 
      row.date &&
      !isNaN(row.max_temp) &&
      !isNaN(row.mean_temp) &&
      !isNaN(row.min_temp) &&
      !isNaN(row.rel_humidity)
    );
  } catch (error) {
    console.error('Error loading temperature data:', error);
    throw error;
  }
}

export async function loadWindData(): Promise<WindData[]> {
  try {
    const response = await fetch('/src/data/wind.csv');
    const csvText = await response.text();
    
    const { data } = Papa.parse<WindData>(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });

    return data.filter(row => 
      row.date &&
      !isNaN(row.mean_wind_speed_kph) &&
      !isNaN(row.max_hourly_mean_wind_speed_kph) &&
      !isNaN(row.min_hourly_mean_wind_speed_kph) &&
      !isNaN(row.high_ten_min_mean_wind_speed_kph) &&
      !isNaN(row.highest_gust_speed_kph)
    );
  } catch (error) {
    console.error('Error loading wind data:', error);
    throw error;
  }
}

export async function loadRainData(): Promise<RainData[]> {
  try {
    const response = await fetch('/src/data/rain.csv');
    const csvText = await response.text();
    
    const { data } = Papa.parse<RainData>(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });

    return data.filter(row => 
      row.date &&
      !isNaN(row.rain_amount_mm) &&
      row.rainfall_bucket
    );
  } catch (error) {
    console.error('Error loading rain data:', error);
    throw error;
  }
}

export async function loadWindRoseData(): Promise<WindRoseData[]> {
  try {
    const data = await d3.csv('/src/data/wind_rose.csv');
    
    // Create a map to store direction and speed bin combinations
    const windRoseMap = new Map<string, { count: number, totalSpeed: number }>();
    
    // Count occurrences of each direction-speed combination
    data.forEach(row => {
      const key = row.direction_bin;
      if (!windRoseMap.has(key)) {
        windRoseMap.set(key, { count: 0, totalSpeed: 0 });
      }
      const entry = windRoseMap.get(key)!;
      entry.count += 1;
      entry.totalSpeed += Number(row.mean_wind_speed_kph);
    });

    // Calculate total records for frequency calculation
    const totalRecords = data.length;

    // Convert to WindRoseData format
    const windRoseData = Array.from(windRoseMap.entries()).map(([direction, stats]) => ({
      direction,
      speed: stats.totalSpeed / stats.count, // average speed for this direction
      frequency: (stats.count / totalRecords) * 100 // convert to percentage
    }));

    return windRoseData;

  } catch (error) {
    console.error('Error loading wind rose data:', error);
    return [];
  }
}
