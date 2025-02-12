import Papa from 'papaparse';

export interface TemperatureData {
  date: string;
  max_temp: number;
  min_temp: number;
  mean_temp: number;
  rel_humidity: number;
}

export interface WindData {
  date: string;
  mean_wind_speed_kph: number;
  max_hourly_mean_wind_speed_kph: number;
  min_hourly_mean_wind_speed_kph: number;
  high_ten_min_mean_wind_speed_kph: number;
  highest_gust_speed_kph: number;
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
