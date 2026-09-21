import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
  type BarShapeProps,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { dashListClass } from "@/components/editorial"
import { cn } from "@/lib/utils"
import { ChartCard } from "@/pages/weather/chart-card"
import { RAIN_CLASSES } from "@/pages/weather/chart-utils"
import { DataTable } from "@/pages/weather/data-table"
import { SeriesLegend, TooltipRow } from "@/pages/weather/series-legend"
import {
  MONTH_LABELS,
  monthIndex,
  RAINFALL_BUCKETS,
  type RainfallBucket,
  type RainRow,
} from "@/pages/weather/weather-data"

const chartConfig = Object.fromEntries(
  RAIN_CLASSES.map(({ key, label, color }) => [key, { label, color }])
) satisfies ChartConfig

const BUCKET_LABELS: Record<RainfallBucket, string> = {
  "Dry (<0.2mm)": "Dry",
  "0.2mm-1mm": "0.2–1 mm",
  "1-5mm": "1–5 mm",
  "5-15mm": "5–15 mm",
  "15-25mm": "15–25 mm",
  ">25mm": ">25 mm",
}

const MONTH_NAMES = MONTH_LABELS.map((_, month) =>
  new Date(2024, month, 1).toLocaleString("en-IE", { month: "long" })
)

// Days of 5 mm or more: the two heaviest classes.
const HEAVY_BUCKETS: readonly RainfallBucket[] = RAIN_CLASSES.slice(3).flatMap(
  ({ buckets }) => buckets
)

/** States the year's finding, which holds whichever way the ramp runs. */
function describe(data: RainRow[]) {
  if (!data.length) return "Days in each rainfall band."
  const wet = data.filter(
    (row) => row.rainfall_bucket !== "Dry (<0.2mm)"
  ).length
  const heavy = data.filter((row) =>
    HEAVY_BUCKETS.includes(row.rainfall_bucket)
  ).length
  return `Days in each rainfall band. Rain fell on ${wet} of ${data.length} days, but ${heavy ? `only ${heavy}` : "none"} brought 5 mm or more.`
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
      const counts = months[monthIndex(row.date)]
      if (counts) counts[row.rainfall_bucket] += 1
    }
    return months
  }, [data])

  const chartData = bucketCounts.map((counts, month) => {
    const days = RAIN_CLASSES.map(({ buckets }) =>
      buckets.reduce((sum, bucket) => sum + counts[bucket], 0)
    )
    return {
      month: MONTH_LABELS[month],
      name: MONTH_NAMES[month],
      // Whichever class ends up on top of the stack gets the rounded corners.
      top: RAIN_CLASSES.findLast((_, index) => (days[index] ?? 0) > 0)?.key,
      ...Object.fromEntries(
        RAIN_CLASSES.map(({ key }, index) => [key, days[index]])
      ),
    }
  })

  const chart = (
    <>
      <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
        <BarChart
          data={chartData}
          barCategoryGap="16%"
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
            content={({ active, label, payload }) => (
              <ChartTooltipContent
                active={active}
                label={label}
                // Only the bands that month had, driest first as stacked.
                payload={payload.filter((item) => item.value)}
                // Recharts types the datum it hands back as `any`.
                labelFormatter={(_, [item]) =>
                  (item?.payload as { name?: string } | undefined)?.name
                }
                formatter={(value, name) => {
                  const rainClass = RAIN_CLASSES.find(({ key }) => key === name)
                  return (
                    <TooltipRow
                      label={rainClass?.label}
                      color={rainClass?.color}
                      value={value === 1 ? "1 day" : `${value} days`}
                    />
                  )
                }}
              />
            )}
          />
          {RAIN_CLASSES.map(({ key }) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="days"
              fill={`var(--color-${key})`}
              stroke="var(--card)"
              strokeWidth={2}
              maxBarSize={30}
              shape={(props: BarShapeProps) => (
                <Rectangle
                  {...props}
                  radius={
                    (props.payload as { top?: string } | undefined)?.top === key
                      ? [4, 4, 0, 0]
                      : 0
                  }
                />
              )}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ChartContainer>
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
      title="How the rain falls, month by month"
      description={describe(data)}
      chart={chart}
      table={table}
      learnMore={
        <>
          <p>
            Ireland&apos;s rainfall patterns are characterised by their
            frequency rather than intensity. The country experiences rain on
            many days throughout the year, but the amount of rainfall per day is
            typically moderate to light.
          </p>
          <h4 className="font-medium text-foreground">
            Understanding rainfall categories
          </h4>
          <ul className={cn(dashListClass, "flex flex-col gap-1")}>
            <li>Dry days (&lt;0.2 mm): Days with negligible rainfall</li>
            <li>Very light (0.2–1 mm): Drizzle or misty conditions</li>
            <li>Light rain (1–5 mm): Common occurrence</li>
            <li>Moderate rain (5–15 mm): Regular rainfall events</li>
            <li>Heavy rain (15–25 mm): Significant rainfall events</li>
            <li>Very heavy rain (&gt;25 mm): Extreme rainfall events</li>
          </ul>
          <h4 className="font-medium text-foreground">Impact on environment</h4>
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
