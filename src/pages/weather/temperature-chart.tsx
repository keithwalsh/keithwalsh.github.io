import { useMemo, useState } from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ChartCard } from "@/pages/weather/chart-card"
import {
  average,
  clampRange,
  formatAxisDate,
  formatNumber,
  groupByMonth,
  monthTicks,
} from "@/pages/weather/chart-utils"
import { DataTable } from "@/pages/weather/data-table"
import { DateRangeSlider } from "@/pages/weather/date-range-slider"
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

export function TemperatureChart({ data }: { data: TemperatureRow[] }) {
  const [range, setRange] = useState<[number, number]>([0, data.length - 1])

  const points = useMemo(
    () =>
      data.map((row) => ({
        date: row.date,
        mean: row.mean_temp,
        range: [row.min_temp, row.max_temp],
        humidity: row.rel_humidity,
      })),
    [data]
  )

  const [start, end] = clampRange(range, points.length)
  const visible = points.slice(start, end + 1)
  const ticks = monthTicks(visible.map((point) => point.date))
  const tickFormatter = (date: string) => formatAxisDate(date, Boolean(ticks))
  const axis = {
    tickLine: false,
    axisLine: false,
  } as const

  const chart = (
    <>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <LegendKey color={TEMPERATURE} shape="line" />
            Temperature (°C)
          </span>
          <span className="flex items-center gap-1.5">
            Relative humidity (%)
            <LegendKey color={HUMIDITY} shape="line" />
          </span>
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-64 w-full"
        >
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
              minTickGap={24}
              {...axis}
            />
            <YAxis
              yAxisId="temperature"
              width="auto"
              domain={[-10, 30]}
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
              content={
                <ChartTooltipContent
                  labelFormatter={dateLabel}
                  formatter={(value, name) => {
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
                      return (
                        <TooltipRow
                          label="Humidity"
                          color={HUMIDITY}
                          value={`${value}%`}
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
              }
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
              yAxisId="temperature"
              dataKey="mean"
              type="monotone"
              stroke="var(--color-mean)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="humidity"
              dataKey="humidity"
              type="monotone"
              stroke="var(--color-humidity)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ChartContainer>
      </div>

      <SeriesLegend
        items={[
          { label: "Mean temperature", color: TEMPERATURE, shape: "line" },
          { label: "Daily min–max", color: TEMPERATURE, shape: "area" },
          { label: "Relative humidity", color: HUMIDITY, shape: "line" },
        ]}
      />
      <DateRangeSlider
        dates={points.map((point) => point.date)}
        value={[start, end]}
        onValueChange={setRange}
      />
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
      title="Temperature and humidity"
      description="Daily readings. Temperature on the left axis, humidity on the right."
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
