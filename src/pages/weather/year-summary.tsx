import { Curve } from "recharts"

import { eyebrowClass } from "@/components/editorial"
import { cn } from "@/lib/utils"
import {
  average,
  formatNumber,
  groupByMonth,
  highest,
  SCALE,
} from "@/pages/weather/chart-utils"
import {
  formatDate,
  type TemperatureRow,
  type WeatherYear,
} from "@/pages/weather/weather-data"

const meanTemperature = (rows: TemperatureRow[]) =>
  average(rows.map((row) => row.mean_temp))

/**
 * The year's twelve monthly mean temperatures. The scale is fixed at 0–18 °C
 * rather than fitted to each year, so a warm year sits visibly higher.
 */
function Sparkline({
  year,
  className,
}: {
  year: WeatherYear
  className: string
}) {
  const points = groupByMonth(year.temperature).map(({ month, rows }) => {
    const mean = meanTemperature(rows)
    return {
      x: (month / 11) * 72,
      y: 20 - (Math.min(Math.max(mean, 0), 18) / 18) * 20,
    }
  })

  return (
    <svg
      viewBox="0 0 72 20"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="h-5 w-full overflow-visible"
    >
      {points.length > 1 && (
        <Curve
          type="monotone"
          layout="horizontal"
          points={points}
          fill="none"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className={className}
        />
      )}
    </svg>
  )
}

/** Every year on record as a button, oldest first. Picks the page's year. */
export function YearRail({
  years,
  selected,
  onSelect,
}: {
  years: WeatherYear[]
  selected: WeatherYear
  onSelect: (year: string) => void
}) {
  return (
    <div
      role="group"
      aria-label="Year"
      className="grid grid-cols-[repeat(auto-fit,minmax(4.75rem,1fr))] gap-1.5"
    >
      {years.map((year) => {
        const active = year === selected
        return (
          <button
            key={year.year}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(year.year)}
            className={cn(
              "flex min-w-0 flex-col gap-1.5 rounded-lg border px-2.25 pt-2 pb-2.25 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active
                ? "border-brand/40 bg-brand-soft text-brand"
                : "bg-card hover:bg-muted"
            )}
          >
            <span className="flex items-baseline justify-between gap-1">
              <span
                className={cn(
                  "font-mono text-caption tracking-wide",
                  active ? "font-semibold" : "font-medium"
                )}
              >
                {year.year}
              </span>
              <span
                className={cn(
                  "text-2xs tabular-nums",
                  !active && "text-muted-foreground"
                )}
              >
                {formatNumber(meanTemperature(year.temperature))}°
              </span>
            </span>
            <Sparkline
              year={year}
              className={active ? "stroke-brand" : "stroke-foreground/35"}
            />
            {year.partial && (
              <span className="font-mono text-micro leading-none text-muted-foreground uppercase">
                Partial
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

type Summary = ReturnType<typeof summarize>

function summarize({ temperature, wind, rain }: WeatherYear) {
  return {
    warmest: highest(temperature, (row) => row.max_temp),
    coldest: highest(temperature, (row) => -row.min_temp),
    wettest: highest(rain, (row) => row.rain_amount_mm),
    windiest: highest(wind, (row) => row.highest_gust_speed_kph),
    dryDays: rain.filter((row) => row.rainfall_bucket === "Dry (<0.2mm)")
      .length,
    meanTemp: meanTemperature(temperature),
  }
}

/** The selected year's records, each set against the other complete years. */
export function YearStats({
  years,
  selected,
}: {
  years: WeatherYear[]
  selected: WeatherYear
}) {
  const current = summarize(selected)
  const others = years
    .filter((year) => year !== selected && !year.partial)
    .map(summarize)

  // A partial year's records aren't comparable with a full year's.
  const delta = (
    measure: (summary: Summary) => number | undefined,
    unit: string,
    digits = 1
  ) => {
    const value = measure(current)
    const baseline = others.map(measure).filter((other) => other !== undefined)
    if (selected.partial || value === undefined || !baseline.length) return
    const difference = Number((value - average(baseline)).toFixed(digits))
    const sign = difference > 0 ? "+" : difference < 0 ? "−" : "±"
    return `${sign}${formatNumber(Math.abs(difference), digits)}${unit} vs avg`
  }

  const { warmest, coldest, wettest, windiest, dryDays, meanTemp } = current
  const cells = [
    {
      label: "Warmest day",
      color: "var(--weather-temperature)",
      value: warmest && formatNumber(warmest.max_temp),
      unit: "°C",
      context: warmest && formatDate(warmest.date),
      delta: delta((summary) => summary.warmest?.max_temp, "°"),
    },
    {
      label: "Coldest night",
      color: "var(--weather-humidity)",
      value: coldest && formatNumber(coldest.min_temp),
      unit: "°C",
      context: coldest && formatDate(coldest.date),
      delta: delta((summary) => summary.coldest?.min_temp, "°"),
    },
    {
      label: "Wettest day",
      color: SCALE[3],
      value: wettest && formatNumber(wettest.rain_amount_mm),
      unit: "mm",
      context: wettest && formatDate(wettest.date),
      delta: delta((summary) => summary.wettest?.rain_amount_mm, " mm"),
    },
    {
      label: "Strongest gust",
      color: "var(--weather-wind-gust)",
      value: windiest && formatNumber(windiest.highest_gust_speed_kph, 0),
      unit: "km/h",
      context: windiest && formatDate(windiest.date),
      delta: delta(
        (summary) => summary.windiest?.highest_gust_speed_kph,
        " km/h",
        0
      ),
    },
    {
      label: "Dry days",
      color: "var(--foreground)",
      value: String(dryDays),
      unit: `of ${selected.rain.length}`,
      context: `${formatNumber((dryDays / Math.max(1, selected.rain.length)) * 100, 0)}% of the year${selected.partial ? " so far" : ""}`,
      delta: delta((summary) => summary.dryDays, " days", 0),
    },
    {
      label: "Mean temp",
      color: "var(--foreground)",
      value: formatNumber(meanTemp),
      unit: "°C",
      context: `${selected.temperature.length} days averaged`,
      delta: delta((summary) => summary.meanTemp, "°"),
    },
  ]

  // Six cells in 1, 2, 3 or 6 columns, so no row is left part-empty. Each
  // cell rules its top and left edge, pulled 1px under the clip, so only the
  // edges between cells show.
  return (
    <div className="@container">
      <dl className="grid grid-cols-1 overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 @xs:grid-cols-2 @lg:grid-cols-3 @5xl:grid-cols-6">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="-mt-px -ml-px flex flex-col gap-1.25 border-t border-l px-4.5 py-4"
          >
            <dt className={eyebrowClass}>{cell.label}</dt>
            <dd
              className="flex items-baseline gap-0.75 text-3xl leading-[1.1] font-semibold tracking-tight tabular-nums"
              style={{ color: cell.color }}
            >
              {cell.value ?? "—"}
              <span className="text-body-sm font-medium tracking-normal">
                {cell.unit}
              </span>
            </dd>
            <dd className="text-caption text-muted-foreground">
              {cell.context ?? "No data"}
            </dd>
            {cell.delta && (
              <dd className="mt-px self-start rounded-sm bg-muted px-1.5 py-0.5 font-mono text-micro text-muted-foreground tabular-nums">
                {cell.delta}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </div>
  )
}
