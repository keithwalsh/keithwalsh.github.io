import Papa from 'papaparse'
import * as d3 from 'd3'

export interface TemperatureData {
  date: string
  year: string
  max_temp: number
  min_temp: number
  mean_temp: number
  rel_humidity: number
}

export interface WindData {
  date: string
  year: string
  mean_wind_speed_kph: number
  max_hourly_mean_wind_speed_kph: number
  min_hourly_mean_wind_speed_kph: number
  high_ten_min_mean_wind_speed_kph: number
  highest_gust_speed_kph: number
}

export interface RainData {
  date: string
  rain_amount_mm: number
  rainfall_bucket: string
}

export interface WindRoseData {
  direction: string
  speed: number
  frequency: number
}

export async function loadTemperatureData(): Promise<TemperatureData[]> {
  try {
    const response = await fetch('/src/data/temperature.csv')
    const csvText = await response.text()

    const { data } = Papa.parse<TemperatureData>(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    })

    return data.filter(
      row =>
        row.date &&
        !isNaN(row.max_temp) &&
        !isNaN(row.mean_temp) &&
        !isNaN(row.min_temp) &&
        !isNaN(row.rel_humidity)
    )
  } catch (error) {
    console.error('Error loading temperature data:', error)
    throw error
  }
}

export async function loadWindData(): Promise<WindData[]> {
  try {
    const response = await fetch('/src/data/wind.csv')
    const csvText = await response.text()

    const { data } = Papa.parse<WindData>(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    })

    return data.filter(
      row =>
        row.date &&
        !isNaN(row.mean_wind_speed_kph) &&
        !isNaN(row.max_hourly_mean_wind_speed_kph) &&
        !isNaN(row.min_hourly_mean_wind_speed_kph) &&
        !isNaN(row.high_ten_min_mean_wind_speed_kph) &&
        !isNaN(row.highest_gust_speed_kph)
    )
  } catch (error) {
    console.error('Error loading wind data:', error)
    throw error
  }
}

export async function loadRainData(): Promise<RainData[]> {
  try {
    const response = await fetch('/src/data/rain.csv')
    const csvText = await response.text()

    const { data } = Papa.parse<RainData>(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    })

    return data.filter(
      row => row.date && !isNaN(row.rain_amount_mm) && row.rainfall_bucket
    )
  } catch (error) {
    console.error('Error loading rain data:', error)
    throw error
  }
}

export async function loadWindRoseData(): Promise<WindRoseData[]> {
  try {
    const data = await d3.csv('/src/data/wind_rose.csv')

    // Create a map to store direction and speed bin combinations
    const windRoseMap = new Map<string, Map<string, number>>()

    // Count raw occurrences for each direction and speed bin
    data.forEach(row => {
      const direction = row.direction_bin
      const speedBin = row.speed_bin

      if (!direction || !speedBin) return // Skip invalid data

      if (!windRoseMap.has(direction)) {
        windRoseMap.set(direction, new Map())
      }

      const speedCounts = windRoseMap.get(direction)!
      const currentCount = speedCounts.get(speedBin) || 0
      speedCounts.set(speedBin, currentCount + 1)
    })

    // Convert to WindRoseData format with raw counts
    const windRoseData: WindRoseData[] = []

    const speedBins = [
      '0-5',
      '5-10',
      '10-15',
      '15-20',
      '20-25',
      '25-30',
      '>=30',
    ]

    windRoseMap.forEach((speedCounts, direction) => {
      speedBins.forEach(speedBin => {
        const count = speedCounts.get(speedBin) || 0
        windRoseData.push({
          direction,
          speed: parseFloat(speedBin.split('-')[0]), // Use lower bound of range
          frequency: count, // Store raw count instead of percentage
        })
      })
    })

    return windRoseData
  } catch (error) {
    console.error('Error loading wind rose data:', error)
    return []
  }
}
