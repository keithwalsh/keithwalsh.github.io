import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type LegendShape = "line" | "dashed" | "dotted" | "area" | "square"

export type LegendItem = {
  label: string
  color: string
  shape: LegendShape
}

const DASHES: Partial<Record<LegendShape, string>> = {
  dashed: "4 3",
  dotted: "0.1 4",
}

export function LegendKey({ color, shape }: Omit<LegendItem, "label">) {
  if (shape === "area" || shape === "square") {
    return (
      <span
        aria-hidden="true"
        className="size-2.5 shrink-0 rounded-xs"
        style={{
          background:
            shape === "area"
              ? `color-mix(in oklab, ${color} 30%, transparent)`
              : color,
        }}
      />
    )
  }

  return (
    <svg aria-hidden="true" width="16" height="4" className="shrink-0">
      <line
        x1="2"
        y1="2"
        x2="14"
        y2="2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={DASHES[shape]}
      />
    </svg>
  )
}

/** Legend rendered as HTML so each key mirrors its mark (line, dash or swatch). */
export function SeriesLegend({
  items,
  className,
}: {
  items: LegendItem[]
  className?: string
}) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground",
        className
      )}
    >
      {items.map(({ label, ...key }) => (
        <li key={label} className="flex items-center gap-1.5">
          <LegendKey {...key} />
          {label}
        </li>
      ))}
    </ul>
  )
}

/** One tooltip row: a short line key, the series name, then the value. */
export function TooltipRow({
  label,
  color,
  value,
}: {
  label: ReactNode
  /** Leave out when the row isn't a series on the chart. */
  color?: string
  value: ReactNode
}) {
  return (
    <div className="flex w-full items-center gap-2">
      {color && (
        <span
          aria-hidden="true"
          className="h-0.5 w-3 shrink-0 rounded-full"
          style={{ background: color }}
        />
      )}
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto pl-4 font-mono font-medium text-foreground tabular-nums">
        {value}
      </span>
    </div>
  )
}
