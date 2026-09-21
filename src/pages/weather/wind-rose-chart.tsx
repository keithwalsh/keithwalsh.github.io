import { useMemo, useRef, useState } from "react"

import { ChartCard } from "@/pages/weather/chart-card"
import { formatNumber } from "@/pages/weather/chart-utils"
import { DataTable } from "@/pages/weather/data-table"
import { SeriesLegend, TooltipRow } from "@/pages/weather/series-legend"
import type { WindRoseData, WindSpeedBin } from "@/pages/weather/weather-data"

const SIZE = 360
const CENTER = SIZE / 2
const OUTER = 136
const INNER = 12
const STEP = 360 / 16
const SECTOR_WIDTH = STEP * 0.86

// Five ordinal steps stay distinguishable, so the lightest and strongest
// winds are grouped; the tooltip and table use the same classes.
const SPEED_CLASSES = [
  {
    key: "calm",
    label: "0–10 km/h",
    bins: ["0-5", "5-10"],
    color: "var(--weather-scale-1)",
  },
  {
    key: "light",
    label: "10–15 km/h",
    bins: ["10-15"],
    color: "var(--weather-scale-2)",
  },
  {
    key: "moderate",
    label: "15–20 km/h",
    bins: ["15-20"],
    color: "var(--weather-scale-3)",
  },
  {
    key: "fresh",
    label: "20–25 km/h",
    bins: ["20-25"],
    color: "var(--weather-scale-4)",
  },
  {
    key: "strong",
    label: "25+ km/h",
    bins: ["25-30", ">=30"],
    color: "var(--weather-scale-5)",
  },
] as const satisfies readonly {
  key: string
  label: string
  bins: readonly WindSpeedBin[]
  color: string
}[]

function polar(radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180
  return [
    CENTER + radius * Math.sin(radians),
    CENTER - radius * Math.cos(radians),
  ] as const
}

function sectorPath(inner: number, outer: number, start: number, end: number) {
  const [x1, y1] = polar(outer, start)
  const [x2, y2] = polar(outer, end)
  const [x3, y3] = polar(inner, end)
  const [x4, y4] = polar(inner, start)
  return `M${x1},${y1} A${outer},${outer} 0 0 1 ${x2},${y2} L${x3},${y3} A${inner},${inner} 0 0 0 ${x4},${y4} Z`
}

/** Smallest "nice" ring interval that fits about four rings. */
function ringStep(maxPercent: number) {
  const raw = maxPercent / 4
  return [1, 2, 2.5, 5, 10, 20, 25, 50].find((step) => step >= raw) ?? 100
}

export function WindRoseChart({
  data,
  year,
  partial = false,
}: {
  data?: WindRoseData
  year: string
  /** The year is still in progress. */
  partial?: boolean
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<{
    index: number
    x: number
    y: number
  } | null>(null)

  const rose = useMemo(() => {
    if (!data || data.totalHours === 0) return null

    const sectors = data.sectors.map((sector) => ({
      direction: sector.direction,
      total: sector.total,
      classHours: SPEED_CLASSES.map(({ bins }) =>
        bins.reduce((sum, bin) => sum + sector.hours[bin], 0)
      ),
    }))
    const maxPercent =
      (Math.max(...sectors.map((sector) => sector.total)) / data.totalHours) *
      100
    const step = ringStep(maxPercent)
    const scaleMax = step * Math.max(1, Math.ceil(maxPercent / step))
    const radiusFor = (hours: number) =>
      INNER + ((OUTER - INNER) * ((hours / data.totalHours) * 100)) / scaleMax
    const prevailing = sectors.reduce((top, sector) =>
      sector.total > top.total ? sector : top
    )

    return {
      prevailing: {
        direction: prevailing.direction,
        share: (prevailing.total / data.totalHours) * 100,
      },
      sectors: sectors.map((sector) => {
        let cumulative = 0
        const segments = sector.classHours.map((hours, index) => {
          const inner = radiusFor(cumulative)
          cumulative += hours
          return {
            hours,
            inner,
            outer: radiusFor(cumulative),
            color: SPEED_CLASSES[index]?.color,
          }
        })
        return {
          ...sector,
          segments,
          share: (sector.total / data.totalHours) * 100,
        }
      }),
      rings: Array.from({ length: scaleMax / step }, (_, index) => {
        const percent = step * (index + 1)
        return {
          percent,
          radius: INNER + ((OUTER - INNER) * percent) / scaleMax,
        }
      }),
    }
  }, [data])

  const showTooltip = (index: number, clientX?: number, clientY?: number) => {
    const rect = wrapperRef.current?.getBoundingClientRect()
    if (!rect) return
    if (clientX === undefined || clientY === undefined) {
      // Keyboard focus: anchor the tooltip at the sector's outer edge.
      const [x, y] = polar(OUTER * 0.6, index * STEP)
      setActive({
        index,
        x: (x / SIZE) * rect.width,
        y: (y / SIZE) * rect.height,
      })
      return
    }
    setActive({ index, x: clientX - rect.left, y: clientY - rect.top })
  }

  const activeSector = active && rose ? rose.sectors[active.index] : null

  const chart = rose ? (
    <>
      <div
        ref={wrapperRef}
        className="relative mx-auto w-full max-w-90"
        onPointerLeave={() => setActive(null)}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full text-muted-foreground"
          role="img"
          aria-label={`Wind rose for ${year}: share of hours by wind direction and speed`}
        >
          {rose.rings.map((ring) => (
            <circle
              key={ring.percent}
              cx={CENTER}
              cy={CENTER}
              r={ring.radius}
              fill="none"
              stroke="var(--border)"
            />
          ))}
          {rose.sectors.map((sector, index) => {
            const [x1, y1] = polar(INNER, index * STEP)
            const [x2, y2] = polar(OUTER, index * STEP)
            return (
              <line
                key={sector.direction}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--border)"
              />
            )
          })}

          {rose.sectors.map((sector, index) => {
            const start = index * STEP - SECTOR_WIDTH / 2
            const end = start + SECTOR_WIDTH
            const isDimmed = active !== null && active.index !== index
            return (
              <g
                key={sector.direction}
                tabIndex={0}
                aria-label={`${sector.direction}: ${formatNumber(sector.share)}% of hours`}
                opacity={isDimmed ? 0.4 : 1}
                className="transition-opacity outline-none"
                onPointerMove={(event) =>
                  showTooltip(index, event.clientX, event.clientY)
                }
                onFocus={() => showTooltip(index)}
                onBlur={() => setActive(null)}
              >
                {/* Transparent full wedge so short sectors are still easy to hover. */}
                <path
                  d={sectorPath(
                    INNER,
                    OUTER,
                    index * STEP - STEP / 2,
                    index * STEP + STEP / 2
                  )}
                  fill="transparent"
                />
                {sector.segments.map(
                  (segment, segmentIndex) =>
                    segment.hours > 0 && (
                      <path
                        key={segmentIndex}
                        d={sectorPath(segment.inner, segment.outer, start, end)}
                        fill={segment.color}
                        stroke="var(--card)"
                        strokeWidth={1.5}
                      />
                    )
                )}
              </g>
            )
          })}

          <circle
            cx={CENTER}
            cy={CENTER}
            r={INNER}
            fill="var(--card)"
            stroke="var(--border)"
          />
          {/* Just inside each ring: above it, the outer label meets the N. */}
          {rose.rings.map((ring) => (
            <text
              key={ring.percent}
              x={CENTER + 4}
              y={CENTER - ring.radius + 3}
              dominantBaseline="hanging"
              fontSize={10}
              fill="currentColor"
              stroke="var(--card)"
              strokeWidth={3}
              paintOrder="stroke"
              className="pointer-events-none"
            >
              {ring.percent}%
            </text>
          ))}
          {rose.sectors.map((sector, index) => {
            const [x, y] = polar(OUTER + 15, index * STEP)
            const isPrevailing = sector.direction === rose.prevailing.direction
            return (
              <text
                key={sector.direction}
                x={x}
                y={y}
                fontSize={index % 2 === 0 ? 12 : 9}
                fontWeight={isPrevailing ? 600 : undefined}
                fill={isPrevailing ? "var(--foreground)" : "currentColor"}
                textAnchor="middle"
                dominantBaseline="central"
                className="pointer-events-none"
              >
                {sector.direction}
              </text>
            )
          })}
        </svg>

        {active && activeSector && (
          <div
            className="pointer-events-none absolute z-10 grid min-w-48 gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl"
            style={{
              left: active.x,
              top: active.y,
              transform: "translate(-50%, calc(-100% - 12px))",
            }}
          >
            <div className="font-medium">
              {activeSector.direction} · {formatNumber(activeSector.share)}% of
              hours
            </div>
            {SPEED_CLASSES.map((speedClass, index) => (
              <TooltipRow
                key={speedClass.key}
                label={speedClass.label}
                color={speedClass.color}
                value={`${(activeSector.classHours[index] ?? 0).toLocaleString("en-IE")} h`}
              />
            ))}
          </div>
        )}
      </div>
      <SeriesLegend
        items={SPEED_CLASSES.map(({ label, color }) => ({
          label,
          color,
          shape: "square",
        }))}
      />
    </>
  ) : (
    <p className="py-12 text-center text-muted-foreground">
      No hourly wind observations for {year}.
    </p>
  )

  const table = rose ? (
    <DataTable
      columns={[
        "Direction",
        ...SPEED_CLASSES.map(({ label }) => label),
        "Share",
      ]}
      rows={rose.sectors.map((sector) => ({
        key: sector.direction,
        cells: [
          sector.direction,
          ...sector.classHours.map((hours) => hours.toLocaleString("en-IE")),
          `${formatNumber(sector.share)}%`,
        ],
      }))}
    />
  ) : (
    chart
  )

  return (
    <ChartCard
      title="Where the wind comes from"
      description={
        rose
          ? `Share of hours by direction and speed. ${rose.prevailing.direction} leads with ${formatNumber(rose.prevailing.share)}% of the year${partial ? " so far" : ""}.`
          : "Share of hours by direction and speed."
      }
      chart={chart}
      table={table}
      learnMore={
        <>
          <p>
            A wind rose is a specialised chart that visualises wind patterns by
            showing both direction and speed frequencies. The chart is divided
            into 16 directional sectors (N, NNE, NE, etc.), with the length of
            each sector indicating how often wind blows from that direction.
          </p>
          <h4 className="font-medium text-foreground">
            Understanding the visualisation
          </h4>
          <p>
            Each directional sector contains coloured bands representing
            different wind speed ranges. The length of these bands shows the
            frequency of winds at those speeds from that direction. The
            concentric circles marked with percentages help quantify these
            frequencies, with longer sectors indicating more prevalent wind
            directions.
          </p>
          <h4 className="font-medium text-foreground">Local wind patterns</h4>
          <p>
            Ireland&apos;s wind patterns are heavily influenced by its position
            in the North Atlantic, with prevailing winds typically coming from
            the southwest. These winds, shaped by the Atlantic Ocean, play a
            crucial role in Ireland&apos;s weather systems and have significant
            implications for various sectors, from aviation and agriculture to
            wind energy production. During Storm Éowyn in January 2025, these
            prevailing patterns were dramatically disrupted, with exceptional
            wind speeds recorded from multiple directions.
          </p>
        </>
      }
    />
  )
}
