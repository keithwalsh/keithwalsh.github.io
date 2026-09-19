import { useEffect, useMemo, useRef, useState } from "react"

import { SegmentedControl } from "@/components/segmented-control"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatNumber, RAIN_CLASSES, SCALE } from "@/pages/weather/chart-utils"
import { SeriesLegend, TooltipRow } from "@/pages/weather/series-legend"
import {
  formatDate,
  MONTH_LABELS,
  type RainfallBucket,
  type RainRow,
  type TemperatureRow,
  type WeatherYear,
  type WindRow,
} from "@/pages/weather/weather-data"

const GUTTER = 34 // month labels, left of the squares
const HEADER = 14 // day numbers, above them
const GAP = 2
const DAY_TICKS = [1, 5, 10, 15, 20, 25, 30]

type Day = {
  date: string
  rain?: RainRow
  temperature?: TemperatureRow
  wind?: WindRow
}

const RAIN_STEPS = Object.fromEntries(
  RAIN_CLASSES.flatMap(({ buckets }, step) =>
    buckets.map((bucket) => [bucket, step])
  )
) as Record<RainfallBucket, number>

/** Which of the five steps `value` falls in, given the four boundaries. */
const stepOf = (value: number, bounds: number[]) =>
  bounds.filter((bound) => value >= bound).length

/** The temperature colour faded into the card, pale to full strength. */
const heat = (percent: number) =>
  `color-mix(in oklab, var(--weather-temperature) ${percent}%, var(--card))`

const METRICS = {
  rain: {
    label: "Rain",
    title: "Rainfall, every day of the year",
    finding: "are wetter",
    legend: ["Dry", "0.2–1 mm", "1–5 mm", "5–15 mm", "15+ mm"],
    colors: SCALE,
    // The CSV's own buckets, so a square matches the rainfall chart's count.
    step: (day: Day) => day.rain && RAIN_STEPS[day.rain.rainfall_bucket],
  },
  temperature: {
    label: "Temp",
    title: "Mean temperature, every day of the year",
    finding: "are warmer",
    legend: ["Under 3°", "3–7°", "7–11°", "11–15°", "15°+"],
    colors: [40, 55, 70, 85, 100].map(heat),
    step: (day: Day) =>
      day.temperature && stepOf(day.temperature.mean_temp, [3, 7, 11, 15]),
  },
  gusts: {
    label: "Gusts",
    title: "Peak gust, every day of the year",
    finding: "blew harder",
    legend: ["Under 40", "40–60", "60–80", "80–100", "100+ km/h"],
    colors: SCALE,
    step: (day: Day) =>
      day.wind && stepOf(day.wind.highest_gust_speed_kph, [40, 60, 80, 100]),
  },
}

type Metric = keyof typeof METRICS

const OPTIONS = (Object.keys(METRICS) as Metric[]).map((value) => ({
  value,
  label: METRICS[value].label,
}))

/** The year as twelve rows of days; a row ends with its month. */
function calendar({ year, rain, temperature, wind }: WeatherYear): Day[][] {
  const byDate = <T extends { date: string }>(rows: T[]) =>
    new Map(rows.map((row) => [row.date, row]))
  const rainOn = byDate(rain)
  const temperatureOn = byDate(temperature)
  const windOn = byDate(wind)

  return MONTH_LABELS.map((_, month) => {
    const days = new Date(Number(year), month + 1, 0).getDate()
    return Array.from({ length: days }, (_, index) => {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`
      return {
        date,
        rain: rainOn.get(date),
        temperature: temperatureOn.get(date),
        wind: windOn.get(date),
      }
    })
  })
}

/** One square per day, coloured by the chosen metric. */
export function CalendarHeatmap({ year }: { year: WeatherYear }) {
  const [metric, setMetric] = useState<Metric>("rain")
  const [hover, setHover] = useState<{
    month: number
    day: number
    x: number
    y: number
  } | null>(null)
  const [width, setWidth] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)

  // The squares are sized in whole pixels to fit, so re-measure on resize. One
  // commit per frame: a state update per observer entry can chase the layout.
  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    let frame = 0
    const observer = new ResizeObserver(([entry]) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() =>
        setWidth(Math.round(entry.contentRect.width))
      )
    })
    observer.observe(box)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  const days = useMemo(() => calendar(year), [year])
  const { title, finding, legend, colors, step } = METRICS[metric]
  const side = Math.max(6, Math.floor((width - GUTTER - 31 * GAP) / 31))
  const pitch = side + GAP

  // One <svg> of <rect>s, built once per year, metric and size: moving the
  // pointer re-renders the tooltip, not 366 squares.
  const squares = useMemo(
    () =>
      days.flatMap((month, row) =>
        month.map((day, column) => {
          const value = step(day)
          return (
            <rect
              key={day.date}
              x={GUTTER + column * pitch}
              y={HEADER + row * pitch}
              width={side}
              height={side}
              rx={2}
              fill={value === undefined ? undefined : colors[value]}
              className={value === undefined ? "fill-muted/55" : undefined}
            />
          )
        })
      ),
    [days, step, colors, side, pitch]
  )

  // Hit-tested from the pointer position rather than a listener per square.
  const point = (event: React.PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - box.left
    const y = event.clientY - box.top
    const month = Math.floor((y - HEADER) / pitch)
    const day = Math.floor((x - GUTTER) / pitch)
    setHover(days[month]?.[day] ? { month, day, x, y } : null)
  }

  const hovered = hover && days[hover.month]?.[hover.day]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {/* Dark mode inverts the ramp: the strongest day is the brightest. */}
        <CardDescription>
          One square per day. <span className="dark:hidden">Darker</span>
          <span className="hidden dark:inline">Brighter</span>
          {` squares ${finding}.`}
        </CardDescription>
        <CardAction>
          <SegmentedControl
            aria-label="Metric"
            value={metric}
            onValueChange={setMetric}
            options={OPTIONS}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div ref={boxRef} className="relative">
          {width > 0 && (
            <svg
              width="100%"
              height={HEADER + 12 * pitch}
              role="img"
              aria-label={`${title}, ${year.year}`}
              className="block"
              onPointerMove={point}
              onPointerDown={point}
              onPointerLeave={(event) => {
                // A tap ends with a leave; keep its tooltip until the next tap.
                if (event.pointerType !== "touch") setHover(null)
              }}
            >
              <g
                aria-hidden="true"
                className="fill-muted-foreground font-mono text-micro"
              >
                {DAY_TICKS.map((day) => (
                  <text
                    key={day}
                    x={GUTTER + (day - 1) * pitch + side / 2}
                    y={8}
                    textAnchor="middle"
                  >
                    {day}
                  </text>
                ))}
                {MONTH_LABELS.map(
                  (label, month) =>
                    // On a phone the rows are too close to label each one.
                    (pitch >= 12 || month % 3 === 0) && (
                      <text
                        key={label}
                        x={GUTTER - 6}
                        y={HEADER + month * pitch + side / 2}
                        textAnchor="end"
                        dominantBaseline="central"
                      >
                        {label.toUpperCase()}
                      </text>
                    )
                )}
              </g>
              {squares}
            </svg>
          )}
          {hover && hovered && (
            <div
              className="pointer-events-none absolute top-0 left-0 z-10 grid min-w-36 gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl"
              style={{
                // Beside the pointer, flipping left past 62% of the width, and
                // above it on the lower six rows so the card doesn't clip it.
                transform: `translate(${hover.x}px, ${hover.y}px) translate(${
                  hover.x > width * 0.62 ? "calc(-100% - 8px)" : "8px"
                }, ${hover.month >= 6 ? "calc(-100% - 12px)" : "24px"})`,
              }}
            >
              <div className="font-medium">{formatDate(hovered.date)}</div>
              <TooltipRow
                label="Rain"
                value={
                  hovered.rain
                    ? `${formatNumber(hovered.rain.rain_amount_mm)} mm`
                    : "—"
                }
              />
              <TooltipRow
                label="Mean temp"
                value={
                  hovered.temperature
                    ? `${formatNumber(hovered.temperature.mean_temp)}°C`
                    : "—"
                }
              />
              <TooltipRow
                label="Peak gust"
                value={
                  hovered.wind
                    ? `${formatNumber(hovered.wind.highest_gust_speed_kph, 0)} km/h`
                    : "—"
                }
              />
            </div>
          )}
        </div>
        <SeriesLegend
          items={legend.map((label, index) => ({
            label,
            color: colors[index],
            shape: "square",
          }))}
        />
      </CardContent>
    </Card>
  )
}
