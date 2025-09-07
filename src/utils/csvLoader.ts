import Papa from 'papaparse'

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
  rainfall_bucket: RainfallBucket
}

// Define valid rainfall bucket values as a type
export type RainfallBucket =
  | 'Dry (<0.2mm)'
  | '0.2mm-1mm'
  | '1-5mm'
  | '5-15mm'
  | '15-25mm'
  | '>25mm'

export interface WindRoseData {
  direction: string
  speed: number
  frequency: number
}

interface CacheConfig {
  useCacheBusting: boolean
  cacheMaxAge?: number // Cache duration in minutes
  forceRefresh?: boolean
}

const defaultCacheConfig: CacheConfig = {
  useCacheBusting: true,
  cacheMaxAge: 60, // 1 hour
  forceRefresh: false,
}

const getDataPath = (
  filename: string,
  config: CacheConfig = defaultCacheConfig
) => {
  const basePath = `/data/${filename}`

  if (!config.useCacheBusting && !config.forceRefresh) {
    return basePath
  }

  const params = new URLSearchParams()

  if (config.forceRefresh) {
    // Force refresh with current timestamp
    params.append('t', Date.now().toString())
  } else if (config.useCacheBusting && config.cacheMaxAge) {
    // Cache busting based on time intervals
    const cacheInterval = config.cacheMaxAge * 60 * 1000 // Convert to milliseconds
    const cacheKey = Math.floor(Date.now() / cacheInterval)
    params.append('v', cacheKey.toString())
  }

  return params.toString() ? `${basePath}?${params.toString()}` : basePath
}

const createFetchOptions = (
  config: CacheConfig = defaultCacheConfig
): RequestInit => {
  const options: RequestInit = {}

  if (config.forceRefresh) {
    options.cache = 'no-cache'
    options.headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    }
  } else if (config.useCacheBusting) {
    options.cache = 'default'
  }

  return options
}

export async function loadTemperatureData(
  config?: CacheConfig
): Promise<TemperatureData[]> {
  try {
    const finalConfig = { ...defaultCacheConfig, ...config }
    const response = await fetch(
      getDataPath('temperature.csv', finalConfig),
      createFetchOptions(finalConfig)
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

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

export async function loadWindData(config?: CacheConfig): Promise<WindData[]> {
  try {
    const finalConfig = { ...defaultCacheConfig, ...config }
    const response = await fetch(
      getDataPath('wind.csv', finalConfig),
      createFetchOptions(finalConfig)
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

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

export async function loadRainData(config?: CacheConfig): Promise<RainData[]> {
  try {
    const finalConfig = { ...defaultCacheConfig, ...config }
    const response = await fetch(
      getDataPath('rain.csv', finalConfig),
      createFetchOptions(finalConfig)
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const csvText = await response.text()

    const { data } = Papa.parse<RainData>(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    })

    // Validate that each row has the correct rainfall bucket value
    const validBuckets: RainfallBucket[] = [
      'Dry (<0.2mm)',
      '0.2mm-1mm',
      '1-5mm',
      '5-15mm',
      '15-25mm',
      '>25mm',
    ]

    return data.filter(row => {
      if (!row.date || !row.rainfall_bucket || isNaN(row.rain_amount_mm)) {
        return false
      }

      // Check if the rainfall bucket is valid
      if (!validBuckets.includes(row.rainfall_bucket as RainfallBucket)) {
        console.warn(`Invalid rainfall bucket value: ${row.rainfall_bucket}`)
        return false
      }

      return true
    })
  } catch (error) {
    console.error('Error loading rain data:', error)
    throw error
  }
}

export async function loadWindRoseData(
  config?: CacheConfig
): Promise<WindRoseData[]> {
  try {
    const finalConfig = { ...defaultCacheConfig, ...config }
    const response = await fetch(
      getDataPath('wind_rose.csv', finalConfig),
      createFetchOptions(finalConfig)
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const csvText = await response.text()

    // Parse CSV with Papa Parse to ensure consistent handling
    const { data } = Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    })

    // Create a map to store direction and speed bin combinations
    const windRoseMap = new Map<string, Map<string, number>>()

    // Count raw occurrences for each direction and speed bin
    data.forEach((row: any) => {
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
          frequency: count,
        })
      })
    })

    return windRoseData
  } catch (error) {
    console.error('Error loading wind rose data:', error)
    return []
  }
}

// Utility function to refresh all data with force refresh
export async function refreshAllData(): Promise<{
  temperature: TemperatureData[]
  wind: WindData[]
  rain: RainData[]
  windRose: WindRoseData[]
}> {
  const forceRefreshConfig: CacheConfig = {
    useCacheBusting: true,
    forceRefresh: true,
  }

  const [temperature, wind, rain, windRose] = await Promise.all([
    loadTemperatureData(forceRefreshConfig),
    loadWindData(forceRefreshConfig),
    loadRainData(forceRefreshConfig),
    loadWindRoseData(forceRefreshConfig),
  ])

  return { temperature, wind, rain, windRose }
}
