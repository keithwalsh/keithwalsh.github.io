import { useMemo, useState } from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  usePlotArea,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Slider } from "@/components/ui/slider"
import { ChartCard } from "@/pages/weather/chart-card"
import {
  average,
  formatAxisDate,
  formatNumber,
  groupByMonth,
  highest,
  inOrder,
  monthTicks,
} from "@/pages/weather/chart-utils"
import { DataTable } from "@/pages/weather/data-table"
import {
  LegendKey,
  SeriesLegend,
  TooltipRow,
} from "@/pages/weather/series-legend"
import { formatDate, type TemperatureRow } from "@/pages/weather/weather-data"

const TEMPERATURE = "var(--weather-temperature)"
const HUMIDITY = "var(--weather-humidity)"

const chartConfig = {
  mean: { label: "Mean", color: TEMPERATURE },
  range: { label: "Min–max", color: TEMPERATURE },
  humidity: { label: "Relative humidity", color: HUMIDITY },
} satisfies ChartConfig

const dateLabel = (value: unknown) => formatDate(String(value))

/** Centred mean, so a year of daily humidity reads as a trend, not a band. */
function rollingMean(values: number[], days: number) {
  const half = Math.floor(days / 2)
  return values.map((_, index) =>
    average(values.slice(Math.max(0, index - half), index + half + 1))
  )
}

/**
 * Names the warmest or coldest point, e.g. `24.6° 19 JUL`: the warmest above
 * its point and the coldest below, each flipping side when there's no room.
 * Held inside the plot's width, so a record at the edge of the window doesn't
 * run into the axis labels.
 */
function ExtremeLabel({
  viewBox,
  text,
  color,
  below = false,
}: {
  /** The point's box, passed in by `ReferenceDot`. */
  viewBox?: { x?: number; y?: number; width?: number; height?: number }
  text: string
  color: string
  below?: boolean
}) {
  const plot = usePlotArea()
  if (!viewBox || !plot) return null

  const { x = 0, y = 0, width = 0, height = 0 } = viewBox
  // The micro size: 10px mono with 0.1em tracking, about 7px a character.
  const half = text.length * 3.5
  const centre = Math.min(
    Math.max(x + width / 2, plot.x + half),
    plot.x + plot.width - half
  )
  // Above may use the chart's top margin; below must stay clear of the x axis.
  const gap = 6.5
  const roomAbove = y - gap - 10 >= 0
  const roomBelow = y + height + gap + 10 <= plot.y + plot.height
  const under = below ? roomBelow : !roomAbove

  return (
    <text
      x={centre}
      y={under ? y + height + gap : y - gap}
      textAnchor="middle"
      dominantBaseline={under ? "hanging" : "auto"}
      fill={color}
      className="font-mono text-micro"
    >
      {text}
    </text>
  )
}

export function TemperatureChart({ data }: { data: TemperatureRow[] }) {
  // The brush belongs to one year's rows; a new year starts on the full year.
  const [brush, setBrush] = useState<{
    rows: TemperatureRow[]
    range: [number, number]
  }>()
  const [start, end] =
    brush?.rows === data ? brush.range : [0, Math.max(0, data.length - 1)]

  const points = useMemo(() => {
    const humidity = rollingMean(
      data.map((row) => row.rel_humidity),
      7
    )
    return data.map((row, index) => ({
      date: row.date,
      mean: row.mean_temp,
      range: [row.min_temp, row.max_temp],
      humidity: humidity[index],
      rh: row.rel_humidity,
    }))
  }, [data])

  const rows = data.slice(start, end + 1)
  const firstRow = rows[0]
  const lastRow = rows.at(-1)
  const visible = points.slice(start, end + 1)
  const ticks = monthTicks(visible.map((point) => point.date))
  const tickFormatter = (date: string) => formatAxisDate(date, Boolean(ticks))
  const axis = {
    tickLine: false,
    axisLine: false,
  } as const

  const warmest = highest(rows, (row) => row.max_temp)
  const coldest = highest(rows, (row) => -row.min_temp)
  const extremes =
    warmest && coldest
      ? [
          {
            key: "max",
            date: warmest.date,
            value: warmest.max_temp,
            color: TEMPERATURE,
            below: false,
          },
          {
            key: "min",
            date: coldest.date,
            value: coldest.min_temp,
            color: HUMIDITY,
            below: true,
          },
        ]
      : []

  const chart = (
    <>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <LegendKey color={TEMPERATURE} shape="line" />
          Temperature (°C)
        </span>
        <span className="flex items-center gap-1.5">
          Relative humidity (%, 7-day mean)
          <LegendKey color={HUMIDITY} shape="line" />
        </span>
      </div>
      <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full">
        <ComposedChart
          data={visible}
          margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
        >
          <CartesianGrid vertical={false} yAxisId="temperature" />
          <XAxis
            dataKey="date"
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickMargin={8}
            minTickGap={8}
            {...axis}
          />
          <YAxis
            yAxisId="temperature"
            width="auto"
            domain={[-10, 30]}
            ticks={[-10, 0, 10, 20, 30]}
            tickFormatter={(value) => `${value}°`}
            {...axis}
          />
          <YAxis
            yAxisId="humidity"
            orientation="right"
            width="auto"
            domain={[20, 100]}
            ticks={[20, 40, 60, 80, 100]}
            tickFormatter={(value) => `${value}%`}
            {...axis}
          />
          <ChartTooltip
            cursor={{ stroke: "var(--border)" }}
            content={({ active, label, payload }) => (
              <ChartTooltipContent
                active={active}
                label={label}
                payload={inOrder(payload, ["mean", "range", "humidity"])}
                labelFormatter={dateLabel}
                formatter={(value, name, item) => {
                  if (name === "range" && Array.isArray(value)) {
                    return (
                      <TooltipRow
                        label="Min–max"
                        color={TEMPERATURE}
                        value={`${value[0]}° to ${value[1]}°`}
                      />
                    )
                  }
                  if (name === "humidity") {
                    // The line is smoothed; the tooltip gives the day's reading.
                    return (
                      <TooltipRow
                        label="Humidity"
                        color={HUMIDITY}
                        value={`${(item.payload as { rh: number }).rh}%`}
                      />
                    )
                  }
                  return (
                    <TooltipRow
                      label="Mean"
                      color={TEMPERATURE}
                      value={`${value}°C`}
                    />
                  )
                }}
              />
            )}
          />
          <Area
            yAxisId="temperature"
            dataKey="range"
            type="monotone"
            fill="var(--color-range)"
            fillOpacity={0.15}
            stroke="none"
            activeDot={false}
            isAnimationActive={false}
          />
          <Line
            yAxisId="humidity"
            dataKey="humidity"
            type="monotone"
            stroke="var(--color-humidity)"
            strokeWidth={1.5}
            strokeOpacity={0.5}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            yAxisId="temperature"
            dataKey="mean"
            type="monotone"
            stroke="var(--color-mean)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          {extremes.map(({ key, date, value, color, below }) => (
            <ReferenceDot
              key={key}
              yAxisId="temperature"
              x={date}
              y={value}
              r={3.5}
              fill="var(--card)"
              stroke={color}
              strokeWidth={2}
              ifOverflow="visible"
              label={
                <ExtremeLabel
                  text={`${formatNumber(value)}° ${formatAxisDate(date, false).toUpperCase()}`}
                  color={color}
                  below={below}
                />
              }
            />
          ))}
        </ComposedChart>
      </ChartContainer>

      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
        <SeriesLegend
          className="justify-start"
          items={[
            { label: "Mean temperature", color: TEMPERATURE, shape: "line" },
            { label: "Daily min–max", color: TEMPERATURE, shape: "area" },
            { label: "Relative humidity", color: HUMIDITY, shape: "line" },
          ]}
        />
        {firstRow && lastRow && (
          <span className="text-xs whitespace-nowrap text-muted-foreground tabular-nums">
            {formatDate(firstRow.date)} – {formatDate(lastRow.date)}
          </span>
        )}
      </div>
      {data.length > 1 && (
        <Slider
          aria-label="Date range"
          min={0}
          max={data.length - 1}
          step={1}
          minStepsBetweenThumbs={1}
          value={[start, end]}
          onValueChange={([nextStart = start, nextEnd = end]) =>
            setBrush({ rows: data, range: [nextStart, nextEnd] })
          }
        />
      )}
    </>
  )

  const table = (
    <DataTable
      columns={["Month", "Mean °C", "Lowest °C", "Highest °C", "Humidity %"]}
      rows={groupByMonth(data).map(({ month, label, rows }) => ({
        key: month,
        cells: [
          label,
          formatNumber(average(rows.map((row) => row.mean_temp))),
          formatNumber(Math.min(...rows.map((row) => row.min_temp))),
          formatNumber(Math.max(...rows.map((row) => row.max_temp))),
          formatNumber(average(rows.map((row) => row.rel_humidity)), 0),
        ],
      }))}
    />
  )

  return (
    <ChartCard
      title="Daily range, mean and humidity"
      description="Temperature on the left axis, relative humidity on the right. Drag the handles to narrow the window."
      chart={chart}
      table={table}
      learnMore={
        <>
          <p>
            Ireland&apos;s distinctive maritime climate is characterised by its
            location, being completely surrounded by ocean. This creates a
            persistent pattern of mild temperatures and frequent rainfall,
            resulting in consistently high humidity levels throughout the year.
          </p>
          <h4 className="font-medium text-foreground">
            Understanding relative humidity
          </h4>
          <p>
            Relative humidity measures the amount of water vapour present in the
            air compared to the maximum amount it could hold at a specific
            temperature. During summer months, when temperatures rise, the
            air&apos;s capacity to hold moisture increases (a phenomenon
            explained by the Clausius-Clapeyron relationship). This leads to
            slight decreases in relative humidity, even though the actual amount
            of moisture in the air might remain similar.
          </p>
          <h4 className="font-medium text-foreground">Impact on daily life</h4>
          <p>
            While high humidity combined with high temperatures can impair the
            body&apos;s cooling mechanism by reducing sweat evaporation,
            Ireland&apos;s moderate climate generally prevents the uncomfortable
            conditions often experienced in warmer regions. Instead, the main
            effects of Ireland&apos;s high humidity are more commonly felt
            indoors, where it can create a damp environment conducive to mould
            and mildew growth.
          </p>
        </>
      }
    />
  )
}
