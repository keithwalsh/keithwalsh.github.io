import {
  MONTH_LABELS,
  monthIndex,
  type RainfallBucket,
} from "@/pages/weather/weather-data"

/** The five-step ordinal ramp, least to most. */
export const SCALE = [1, 2, 3, 4, 5].map(
  (step) => `var(--weather-scale-${step})`
)

// The ordinal ramp has five distinguishable steps, so the two rarest,
// heaviest buckets share a colour; the rainfall table keeps all six apart.
export const RAIN_CLASSES = [
  {
    key: "dry",
    label: "Dry (<0.2 mm)",
    buckets: ["Dry (<0.2mm)"],
    color: SCALE[0],
  },
  {
    key: "drizzle",
    label: "0.2–1 mm",
    buckets: ["0.2mm-1mm"],
    color: SCALE[1],
  },
  {
    key: "light",
    label: "1–5 mm",
    buckets: ["1-5mm"],
    color: SCALE[2],
  },
  {
    key: "moderate",
    label: "5–15 mm",
    buckets: ["5-15mm"],
    color: SCALE[3],
  },
  {
    key: "heavy",
    label: "15 mm or more",
    buckets: ["15-25mm", ">25mm"],
    color: SCALE[4],
  },
] as const satisfies readonly {
  key: string
  label: string
  buckets: readonly RainfallBucket[]
  color: string
}[]

export function groupByMonth<T extends { date: string }>(rows: T[]) {
  const groups = new Map<number, T[]>()
  for (const row of rows) {
    const month = monthIndex(row.date)
    const group = groups.get(month)
    if (group) {
      group.push(row)
    } else {
      groups.set(month, [row])
    }
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a - b)
    .map(([month, items]) => ({
      month,
      label: MONTH_LABELS[month],
      rows: items,
    }))
}

export const average = (values: number[]) =>
  values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0

/** The row with the largest `value`, the earliest on a tie. */
export const highest = <T>(rows: T[], value: (row: T) => number) =>
  rows.reduce<T | undefined>(
    (best, row) => (best && value(best) >= value(row) ? best : row),
    undefined
  )

export const formatNumber = (value: number, digits = 1) =>
  value.toLocaleString("en-IE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })

/** About four ticks from 0 past `max`, stepping by 1, 2, 2.5 or 5 × 10ⁿ. */
export function niceTicks(max: number) {
  const raw = Math.max(max, 1) / 4
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const step =
    [1, 2, 2.5, 5].map((m) => m * magnitude).find((s) => s >= raw) ??
    10 * magnitude
  return Array.from(
    { length: Math.ceil(Math.max(max, 1) / step) + 1 },
    (_, index) => index * step
  )
}

/** First-of-month ticks once the visible range spans at least two months. */
export function monthTicks(dates: string[]) {
  const ticks = dates.filter((date) => date.endsWith("-01"))
  return ticks.length >= 2 ? ticks : undefined
}

export function formatAxisDate(date: string, monthly: boolean) {
  const month = MONTH_LABELS[monthIndex(date)]
  return monthly ? month : `${Number(date.slice(8, 10))} ${month}`
}

/**
 * Tooltip entries in the order of `keys`, e.g. top to bottom as drawn rather
 * than back to front. `ChartTooltipContent` ignores Recharts' `itemSorter`.
 */
export const inOrder = <T extends { dataKey?: unknown }>(
  payload: readonly T[],
  keys: readonly string[]
) =>
  [...payload].sort(
    (a, b) => keys.indexOf(String(a.dataKey)) - keys.indexOf(String(b.dataKey))
  )
