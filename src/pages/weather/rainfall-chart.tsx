import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ChartCard } from "@/pages/weather/chart-card"
import { DataTable } from "@/pages/weather/data-table"
import { SeriesLegend, TooltipRow } from "@/pages/weather/series-legend"
import {
  MONTH_LABELS,
  monthIndex,
  RAINFALL_BUCKETS,
  type RainfallBucket,
  type RainRow,
} from "@/pages/weather/weather-data"

// The ordinal ramp has five distinguishable steps, so the two rarest,
// heaviest buckets share a colour; the table view keeps all six apart.
const RAIN_CLASSES = [
  {
    key: "dry",
    label: "Dry (<0.2mm)",
    buckets: ["Dry (<0.2mm)"],
    color: "var(--weather-scale-1)",
  },
  {
    key: "drizzle",
    label: "0.2–1mm",
    buckets: ["0.2mm-1mm"],
    color: "var(--weather-scale-2)",
  },
  {
    key: "light",
    label: "1–5mm",
    buckets: ["1-5mm"],
    color: "var(--weather-scale-3)",
  },
  {
    key: "moderate",
    label: "5–15mm",
    buckets: ["5-15mm"],
    color: "var(--weather-scale-4)",
  },
  {
    key: "heavy",
    label: "15mm or more",
    buckets: ["15-25mm", ">25mm"],
    color: "var(--weather-scale-5)",
  },
] as const satisfies readonly {
  key: string
  label: string
  buckets: readonly RainfallBucket[]
  color: string
}[]

const chartConfig = Object.fromEntries(
  RAIN_CLASSES.map(({ key, label, color }) => [key, { label, color }])
) satisfies ChartConfig

const BUCKET_LABELS: Record<RainfallBucket, string> = {
  "Dry (<0.2mm)": "Dry",
  "0.2mm-1mm": "0.2–1mm",
  "1-5mm": "1–5mm",
  "5-15mm": "5–15mm",
  "15-25mm": "15–25mm",
  ">25mm": ">25mm",
}

export function RainfallChart({ data }: { data: RainRow[] }) {
  const bucketCounts = useMemo(() => {
    const months = MONTH_LABELS.map(
      () =>
        Object.fromEntries(
          RAINFALL_BUCKETS.map((bucket) => [bucket, 0])
        ) as Record<RainfallBucket, number>
    )
    for (const row of data) {
      months[monthIndex(row.date)][row.rainfall_bucket] += 1
    }
    return months
  }, [data])

  const chartData = bucketCounts.map((counts, month) => ({
    month: MONTH_LABELS[month],
    ...Object.fromEntries(
      RAIN_CLASSES.map(({ key, buckets }) => [
        key,
        buckets.reduce((sum, bucket) => sum + counts[bucket], 0),
      ])
    ),
  }))

  const chart = (
    <>
      <div className="flex flex-col gap-1">
        <p className="text-xs text-muted-foreground">Days per month</p>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-72 w-full"
        >
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              width="auto"
              domain={[0, 31]}
              ticks={[0, 10, 20, 30]}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const rainClass = RAIN_CLASSES.find(
                      ({ key }) => key === name
                    )
                    return (
                      <TooltipRow
                        label={rainClass?.label}
                        color={rainClass?.color ?? "currentColor"}
                        value={`${value} days`}
                      />
                    )
                  }}
                />
              }
            />
            {RAIN_CLASSES.map(({ key }, index) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="days"
                fill={`var(--color-${key})`}
                stroke="var(--card)"
                strokeWidth={2}
                maxBarSize={24}
                radius={index === RAIN_CLASSES.length - 1 ? [4, 4, 0, 0] : 0}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </div>
      <SeriesLegend
        items={RAIN_CLASSES.map(({ label, color }) => ({
          label,
          color,
          shape: "square",
        }))}
      />
    </>
  )

  const table = (
    <DataTable
      columns={[
        "Month",
        ...RAINFALL_BUCKETS.map((bucket) => BUCKET_LABELS[bucket]),
      ]}
      rows={bucketCounts.map((counts, month) => ({
        key: month,
        cells: [
          MONTH_LABELS[month],
          ...RAINFALL_BUCKETS.map((bucket) => counts[bucket]),
        ],
      }))}
    />
  )

  return (
    <ChartCard
      title="Monthly Rainfall Distribution"
      description="Number of days in each daily rainfall band."
      chart={chart}
      table={table}
      learnMore={
        <>
          <p>
            Ireland&apos;s rainfall patterns are characterized by their
            frequency rather than intensity. The country experiences rain on
            many days throughout the year, but the amount of rainfall per day is
            typically moderate to light.
          </p>
          <h4 className="font-medium text-foreground">
            Understanding Rainfall Categories
          </h4>
          <ul className="ml-4 flex list-disc flex-col gap-1">
            <li>Dry days (&lt;0.2mm): Days with negligible rainfall</li>
            <li>Very light (0.2-1mm): Drizzle or misty conditions</li>
            <li>Light rain (1-5mm): Common occurrence</li>
            <li>Moderate rain (5-15mm): Regular rainfall events</li>
            <li>Heavy rain (15-25mm): Significant rainfall events</li>
            <li>Very heavy rain (&gt;25mm): Extreme rainfall events</li>
          </ul>
          <h4 className="font-medium text-foreground">Impact on Environment</h4>
          <p>
            This rainfall pattern is crucial for Ireland&apos;s ecosystem,
            supporting the country&apos;s famous green landscape and
            agricultural activities. The consistent distribution of rainfall
            throughout the year, rather than concentrated wet seasons, helps
            maintain stable soil moisture levels and supports sustainable
            farming practices.
          </p>
        </>
      }
    />
  )
}
