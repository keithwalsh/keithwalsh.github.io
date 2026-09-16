import { Slider } from "@/components/ui/slider"
import { formatDate } from "@/pages/weather/weather-data"

/** Two-thumb slider that narrows a chart to a range of dates. */
export function DateRangeSlider({
  dates,
  value,
  onValueChange,
}: {
  dates: string[]
  value: [number, number]
  onValueChange: (value: [number, number]) => void
}) {
  if (dates.length < 2) return null

  const [start, end] = value

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-medium">Date range</span>
        <span className="text-muted-foreground tabular-nums">
          {formatDate(dates[start])} – {formatDate(dates[end])}
        </span>
      </div>
      <Slider
        aria-label="Date range"
        min={0}
        max={dates.length - 1}
        step={1}
        minStepsBetweenThumbs={1}
        value={value}
        onValueChange={([nextStart, nextEnd]) =>
          onValueChange([nextStart, nextEnd])
        }
      />
    </div>
  )
}
