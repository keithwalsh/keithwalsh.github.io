import { Fragment, useMemo } from "react"

import { cn } from "@/lib/utils"
import {
  describeSegments,
  type CronFieldKey,
  type CronFields,
} from "@/pages/tools/cron-expressions/cron"

export function CronSentence({
  fields,
  active,
  hover,
  onHoverChange,
}: {
  fields: CronFields
  active: CronFieldKey
  hover: CronFieldKey[]
  onHoverChange: (keys: CronFieldKey[]) => void
}) {
  const segments = useMemo(() => describeSegments(fields), [fields])

  return (
    <p
      aria-live="polite"
      className="min-h-16 text-2xl leading-8 font-medium tracking-tight text-pretty @md:min-h-19 @md:text-3xl @md:leading-[2.375rem]"
    >
      {segments.map((segment, index) => (
        // Keyed by text, so a segment that changes remounts and replays its entrance.
        <Fragment key={`${segment.keys.join("+")}:${segment.text}`}>
          {index > 0 && (
            <span className="text-muted-foreground">
              {segment.text.startsWith("and ") ? " " : ", "}
            </span>
          )}
          <span
            onPointerEnter={() => onHoverChange(segment.keys)}
            onPointerLeave={() => onHoverChange([])}
            className={cn(
              "relative decoration-foreground/18 decoration-dotted decoration-[1.5px] underline-offset-[5px] transition-[color,text-decoration-color] duration-150 motion-safe:animate-cron-fade",
              segment.keys.length > 0 && "underline",
              segment.keys.some(
                (key) => key === active || hover.includes(key)
              ) && "text-brand decoration-brand"
            )}
          >
            {segment.text}
          </span>
        </Fragment>
      ))}
    </p>
  )
}
