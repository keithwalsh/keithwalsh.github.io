import Papa from "papaparse"

import { assetUrl } from "@/lib/browser"

export type TemperatureRow = {
  date: string
  max_temp: number
  min_temp: number
  mean_temp: number
  rel_humidity: number
}

export type WindRow = {
  date: string
  mean_wind_speed_kph: number
  max_hourly_mean_wind_speed_kph: number
  min_hourly_mean_wind_speed_kph: number
  high_ten_min_mean_wind_speed_kph: number
  highest_gust_speed_kph: number
}

export const RAINFALL_BUCKETS = [
  "Dry (<0.2mm)",
  "0.2mm-1mm",
  "1-5mm",
  "5-15mm",
  "15-25mm",
  ">25mm",
] as const

export type RainfallBucket = (typeof RAINFALL_BUCKETS)[number]

export type RainRow = {
  date: string
  rain_amount_mm: number
  rainfall_bucket: RainfallBucket
}

export const WIND_SPEED_BINS = [
  "0-5",
  "5-10",
  "10-15",
  "15-20",
  "20-25",
  "25-30",
  ">=30",
] as const

export type WindSpeedBin = (typeof WIND_SPEED_BINS)[number]

export const COMPASS_DIRECTIONS = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
] as const

export type WindRoseSector = {
  direction: (typeof COMPASS_DIRECTIONS)[number]
  hours: Record<WindSpeedBin, number>
  total: number
}

export type WindRoseData = {
  sectors: WindRoseSector[]
  totalHours: number
}

export type WeatherData = {
  temperature: TemperatureRow[]
  wind: WindRow[]
  rain: RainRow[]
  windRoseByYear: Record<string, WindRoseData>
}

type WindRoseRow = {
  datetime: string
  direction_bin: string
  speed_bin: string
}

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value)

async function fetchCsv<T>(filename: string, forceRefresh: boolean) {
  // Cache-bust hourly by default; a manual refresh skips the HTTP cache.
  const version = forceRefresh
    ? `t=${Date.now()}`
    : `v=${Math.floor(Date.now() / 3_600_000)}`
  const response = await fetch(`${assetUrl(`data/${filename}`)}?${version}`, {
    cache: forceRefresh ? "no-store" : "default",
  })
  if (!response.ok) {
    throw new Error(`Couldn't load ${filename} (HTTP ${response.status})`)
  }

  const { data } = Papa.parse<Partial<T>>(await response.text(), {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  })
  return data
}

function emptyHours() {
  return Object.fromEntries(WIND_SPEED_BINS.map((bin) => [bin, 0])) as Record<
    WindSpeedBin,
    number
  >
}

/** Counts hourly observations per year, compass direction and speed bin. */
function aggregateWindRose(rows: Partial<WindRoseRow>[]) {
  const byYear = new Map<string, Map<string, Record<WindSpeedBin, number>>>()

  for (const row of rows) {
    const bin = row.speed_bin as WindSpeedBin
    const year =
      typeof row.datetime === "string" ? row.datetime.slice(0, 4) : ""
    if (!year || !row.direction_bin || !WIND_SPEED_BINS.includes(bin)) continue

    const directions = byYear.get(year) ?? new Map()
    const hours = directions.get(row.direction_bin) ?? emptyHours()
    hours[bin] += 1
    directions.set(row.direction_bin, hours)
    byYear.set(year, directions)
  }

  const result: Record<string, WindRoseData> = {}
  for (const [year, directions] of byYear) {
    const sectors = COMPASS_DIRECTIONS.map((direction) => {
      const hours = directions.get(direction) ?? emptyHours()
      const total = Object.values(hours).reduce((sum, count) => sum + count, 0)
      return { direction, hours, total }
    })
    const totalHours = sectors.reduce((sum, sector) => sum + sector.total, 0)
    result[year] = { sectors, totalHours }
  }
  return result
}

export async function loadWeatherData(
  forceRefresh = false
): Promise<WeatherData> {
  const [temperature, wind, rain, windRose] = await Promise.all([
    fetchCsv<TemperatureRow>("temperature.csv", forceRefresh),
    fetchCsv<WindRow>("wind.csv", forceRefresh),
    fetchCsv<RainRow>("rain.csv", forceRefresh),
    fetchCsv<WindRoseRow>("wind_rose.csv", forceRefresh),
  ])

  return {
    temperature: temperature.filter(
      (row): row is TemperatureRow =>
        typeof row.date === "string" &&
        isNumber(row.max_temp) &&
        isNumber(row.min_temp) &&
        isNumber(row.mean_temp) &&
        isNumber(row.rel_humidity)
    ),
    wind: wind.filter(
      (row): row is WindRow =>
        typeof row.date === "string" &&
        isNumber(row.mean_wind_speed_kph) &&
        isNumber(row.max_hourly_mean_wind_speed_kph) &&
        isNumber(row.min_hourly_mean_wind_speed_kph) &&
        isNumber(row.high_ten_min_mean_wind_speed_kph) &&
        isNumber(row.highest_gust_speed_kph)
    ),
    rain: rain.filter(
      (row): row is RainRow =>
        typeof row.date === "string" &&
        isNumber(row.rain_amount_mm) &&
        RAINFALL_BUCKETS.includes(row.rainfall_bucket as RainfallBucket)
    ),
    windRoseByYear: aggregateWindRose(windRose),
  }
}

/** Years present in the data, newest first. */
export function availableYears(rows: { date: string }[]) {
  return [...new Set(rows.map((row) => row.date.slice(0, 4)))].sort().reverse()
}

/** Rows for one year in date order. ISO date strings avoid timezone shifts. */
export function rowsForYear<T extends { date: string }>(
  rows: T[],
  year: string
) {
  return rows
    .filter((row) => row.date.startsWith(year))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export const MONTH_LABELS = Array.from({ length: 12 }, (_, month) =>
  new Date(2024, month, 1).toLocaleString("en-IE", { month: "short" })
)

export const monthIndex = (date: string) => Number(date.slice(5, 7)) - 1

export function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
