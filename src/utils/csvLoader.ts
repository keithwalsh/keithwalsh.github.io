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
    const data = await d3.csv('/src/data/wind_rose.csv')
    
    // Define speed ranges
    const speedRanges = [0, 5, 10, 15, 20, 25]
    
    // Create a map to store direction and speed bin combinations
    const windRoseMap = new Map<string, Map<number, number>>()
    
    // Count occurrences for each direction and speed range
    data.forEach(row => {
      const direction = row.direction_bin
      const speed = Number(row.mean_wind_speed_kph)
      
      if (!direction || isNaN(speed)) return // Skip invalid data
      
      if (!windRoseMap.has(direction)) {
        windRoseMap.set(direction, new Map())
      }
      
      // Find the appropriate speed bin
      let speedBin = speedRanges.length - 1 // Default to highest bin
      for (let i = 0; i < speedRanges.length - 1; i++) {
        if (speed >= speedRanges[i] && speed < speedRanges[i + 1]) {
          speedBin = i
          break
        }
      }
      
      const speedCounts = windRoseMap.get(direction)!
      const currentCount = speedCounts.get(speedBin) || 0
      speedCounts.set(speedBin, currentCount + 1)
    })

    // Calculate total records for frequency calculation
    const totalRecords = data.length

    // Convert to WindRoseData format
    const windRoseData: WindRoseData[] = []
    
    windRoseMap.forEach((speedCounts, direction) => {
      for (let i = 0; i < speedRanges.length - 1; i++) {
        const count = speedCounts.get(i) || 0
        windRoseData.push({
          direction,
          speed: speedRanges[i], // Lower bound of the range
          frequency: (count / totalRecords) * 100
        })
      }
    })

    // Debug log
    console.log('Wind Rose Data:', windRoseData)

    return windRoseData

  } catch (error) {
    console.error('Error loading wind rose data:', error)
    return []
  }
}
