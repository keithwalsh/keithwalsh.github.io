import Papa from 'papaparse';

export interface TemperatureData {
  date: string;
  max_temp: number;
  min_temp: number;
  mean_temp: number;
  rel_humidity: number;
}

export const loadTemperatureData = async (): Promise<TemperatureData[]> => {
  try {
    const response = await fetch('/src/data/temperature.csv');
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          resolve(results.data as TemperatureData[]);
        },
        error: (error: Papa.ParseError) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading temperature data:', error);
    return [];
  }
};
