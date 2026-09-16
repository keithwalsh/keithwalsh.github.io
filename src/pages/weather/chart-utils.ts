import { MONTH_LABELS, monthIndex } from "@/pages/weather/weather-data"

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

export const formatNumber = (value: number, digits = 1) =>
  value.toLocaleString("en-IE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })

/** First-of-month ticks once the visible range spans at least two months. */
export function monthTicks(dates: string[]) {
  const ticks = dates.filter((date) => date.endsWith("-01"))
  return ticks.length >= 2 ? ticks : undefined
}

export function formatAxisDate(date: string, monthly: boolean) {
  const month = MONTH_LABELS[monthIndex(date)]
  return monthly ? month : `${Number(date.slice(8, 10))} ${month}`
}

/** Keeps an index range valid when the underlying rows change. */
export function clampRange(
  [start, end]: [number, number],
  length: number
): [number, number] {
  const last = Math.max(0, length - 1)
  return [Math.min(start, last), Math.min(Math.max(end, start), last)]
}
