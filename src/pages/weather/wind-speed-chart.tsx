import { useMemo } from "react"
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
  formatAxisDate,
  formatNumber,
  groupByMonth,
  inOrder,
  monthTicks,
  niceTicks,
} from "@/pages/weather/chart-utils"
import { DataTable } from "@/pages/weather/data-table"
import { SeriesLegend, TooltipRow } from "@/pages/weather/series-legend"
import { formatDate, type WindRow } from "@/pages/weather/weather-data"

const MEAN = "var(--weather-wind-mean)"
const TEN_MIN = "var(--weather-wind-ten-min)"
const GUST = "var(--weather-wind-gust)"

const chartConfig = {
  mean: { label: "Mean wind speed", color: MEAN },
  range: { label: "Hourly mean range", color: MEAN },
  tenMin: { label: "Max. 10-min mean", color: TEN_MIN },
  gust: { label: "Max. gust", color: GUST },
} satisfies ChartConfig

const TOOLTIP_ROWS: Record<string, { label: string; color: string }> = {
  gust: { label: "Max. gust", color: GUST },
  tenMin: { label: "Max. 10-min mean", color: TEN_MIN },
  range: { label: "Hourly mean range", color: MEAN },
  mean: { label: "Mean", color: MEAN },
}

export function WindSpeedChart({ data }: { data: WindRow[] }) {
  const points = useMemo(
    () =>
      data.map((row) => ({
        date: row.date,
        mean: row.mean_wind_speed_kph,
        range: [
          row.min_hourly_mean_wind_speed_kph,
          row.max_hourly_mean_wind_speed_kph,
        ],
        tenMin: row.high_ten_min_mean_wind_speed_kph,
        gust: row.highest_gust_speed_kph,
      })),
    [data]
  )

  const ticks = monthTicks(points.map((point) => point.date))
  const speedTicks = niceTicks(Math.max(...points.map((point) => point.gust)))

  const chart = (
    <>
      <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
        <ComposedChart
          data={points}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            ticks={ticks}
            tickFormatter={(date: string) =>
              formatAxisDate(date, Boolean(ticks))
            }
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={8}
          />
          <YAxis
            width="auto"
            domain={[0, speedTicks.at(-1) ?? "auto"]}
            ticks={speedTicks}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip
            cursor={{ stroke: "var(--border)" }}
            content={({ active, label, payload }) => (
              <ChartTooltipContent
                active={active}
                label={label}
                payload={inOrder(payload, ["gust", "tenMin", "range", "mean"])}
                labelFormatter={(value) => formatDate(String(value))}
                formatter={(value, name) => {
                  const row = TOOLTIP_ROWS[String(name)]
                  const text = Array.isArray(value)
                    ? `${value[0]}–${value[1]} km/h`
                    : `${value} km/h`
                  return (
                    <TooltipRow
                      label={row?.label}
                      color={row?.color}
                      value={text}
                    />
                  )
                }}
              />
            )}
          />
          <Area
            dataKey="range"
            type="monotone"
            fill="var(--color-range)"
            fillOpacity={0.15}
            stroke="none"
            activeDot={false}
            isAnimationActive={false}
          />
          <Line
            dataKey="gust"
            type="monotone"
            stroke="var(--color-gust)"
            strokeWidth={2}
            strokeDasharray="0.1 4"
            strokeLinecap="round"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            dataKey="tenMin"
            type="monotone"
            stroke="var(--color-tenMin)"
            strokeWidth={2}
            strokeDasharray="4 3"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            dataKey="mean"
            type="monotone"
            stroke="var(--color-mean)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ChartContainer>

      <SeriesLegend
        items={[
          { label: "Mean", color: MEAN, shape: "line" },
          { label: "Hourly mean range", color: MEAN, shape: "area" },
          { label: "Max. 10-min mean", color: TEN_MIN, shape: "dashed" },
          { label: "Max. gust", color: GUST, shape: "dotted" },
        ]}
      />
    </>
  )

  const table = (
    <DataTable
      columns={["Month", "Mean km/h", "Max. 10-min km/h", "Max. gust km/h"]}
      rows={groupByMonth(data).map(({ month, label, rows }) => ({
        key: month,
        cells: [
          label,
          formatNumber(average(rows.map((row) => row.mean_wind_speed_kph))),
          formatNumber(
            Math.max(...rows.map((row) => row.high_ten_min_mean_wind_speed_kph))
          ),
          formatNumber(
            Math.max(...rows.map((row) => row.highest_gust_speed_kph))
          ),
        ],
      }))}
    />
  )

  return (
    <ChartCard
      title="How hard it blew"
      description="Daily mean, sustained wind and peak gust, in km/h."
      chart={chart}
      table={table}
      learnMore={
        <>
          <p>
            Wind speed measurements in Ireland are collected using various
            time-averaged methods to capture different aspects of wind
            behaviour. These measurements help in understanding both sustained
            winds and brief intense gusts that can affect infrastructure and
            daily activities.
          </p>
          <h4 className="font-medium text-foreground">
            Understanding wind measurements
          </h4>
          <p>
            Mean wind speed represents the average wind conditions over time.
            The maximum gust captures brief peaks in wind speed, typically
            lasting 3–5 seconds. The 10-minute mean provides a more stable
            measure of sustained winds, while hourly means show longer-term
            patterns, with maximum and minimum values indicating the range of
            wind conditions throughout each hour.
          </p>
          <h4 className="font-medium text-foreground">Impact on daily life</h4>
          <p>
            Wind patterns significantly influence Ireland&apos;s weather systems
            and daily activities. This is dramatically demonstrated in the 2025
            data by the large spike on 24 January 2025, when Storm Éowyn brought
            record-breaking wind gusts and caused widespread destruction across
            the country. This devastating storm left 768,000 homes without power
            and caused an estimated €200 million in damage. Understanding these
            measurements helps in planning outdoor activities, assessing
            weather-related risks, and preparing for severe weather events,
            which Met Éireann warns are likely to become more frequent in the
            years ahead.
          </p>
        </>
      }
    />
  )
}
