import { useState } from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  CRON_FIELDS,
  FIELD_KEYS,
  formatCronExpression,
  parseCronExpression,
  type CronFieldKey,
  type CronFields,
} from "@/pages/tools/cron-expressions/cron"

// A label's column narrows as other tokens grow. Below these widths the label
// switches to an abbreviation rather than running into its neighbour.
const ABBREVIATIONS: Partial<
  Record<CronFieldKey, { text: string; full: string; short: string }>
> = {
  hours: {
    text: "hr",
    full: "hidden @[1.9375rem]:inline",
    short: "@[1.9375rem]:hidden",
  },
  month: {
    text: "mon",
    full: "hidden @[2.5rem]:inline",
    short: "@[2.5rem]:hidden",
  },
  dayOfWeek: {
    text: "dow",
    full: "hidden @[3.25rem]:inline",
    short: "@[3.25rem]:hidden",
  },
}

/**
 * The five tokens of the expression, or a text box for pasting one. The
 * paste toggle lives in the page toolbar, so `isPasting` is owned there.
 */
export function CronExpressionBar({
  fields,
  active,
  hover,
  isPasting,
  onPastingChange,
  onActiveChange,
  onHoverChange,
  onFieldsChange,
}: {
  fields: CronFields
  active: CronFieldKey
  hover: CronFieldKey[]
  isPasting: boolean
  onPastingChange: (isPasting: boolean) => void
  onActiveChange: (key: CronFieldKey) => void
  onHoverChange: (keys: CronFieldKey[]) => void
  onFieldsChange: (fields: CronFields) => void
}) {
  const expression = formatCronExpression(fields)
  // Typed text is shown only while it still matches the fields, so a preset
  // or random roll made meanwhile replaces it.
  const [draft, setDraft] = useState<{
    text: string
    expression: string
  } | null>(null)

  const rawText = draft?.expression === expression ? draft.text : expression

  const changeRawText = (text: string) => {
    const parsed = parseCronExpression(text)
    if (parsed) {
      onFieldsChange(parsed)
    }
    setDraft({
      text,
      expression: parsed ? formatCronExpression(parsed) : expression,
    })
  }

  return (
    // Tokens and labels share subgrid columns sized by each token's value, so
    // longer values like */15 get room without breaking the label alignment.
    <div className="grid grid-cols-[repeat(5,minmax(0,auto))] gap-x-1 gap-y-2.5">
      {isPasting ? (
        <Input
          autoFocus
          aria-label="Cron expression"
          aria-invalid={parseCronExpression(rawText) === null}
          value={rawText}
          placeholder="*/15 9-17 * * 1-5"
          onChange={(event) => changeRawText(event.target.value)}
          onFocus={(event) => event.currentTarget.select()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === "Escape") {
              setDraft(null)
              onPastingChange(false)
            }
          }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="col-span-5 h-14 rounded-xl bg-background px-4 font-mono text-xl tracking-wider md:text-xl dark:bg-background"
        />
      ) : (
        <div
          role="group"
          aria-label="Expression fields"
          className="col-span-5 grid h-14 grid-cols-subgrid items-center gap-x-1 rounded-xl bg-tool-pane p-1.5 ring-1 ring-foreground/8"
        >
          {FIELD_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              aria-label={`${CRON_FIELDS[key].label} ${fields[key]}`}
              aria-current={key === active ? "true" : undefined}
              onClick={() => onActiveChange(key)}
              onPointerEnter={() => onHoverChange([key])}
              onPointerLeave={() => onHoverChange([])}
              onFocus={() => onHoverChange([key])}
              onBlur={() => onHoverChange([])}
              className={cn(
                "h-full min-w-0 truncate rounded-lg px-2 text-center font-mono text-xl font-medium transition-colors duration-150 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                hover.includes(key) && "bg-brand-soft text-brand",
                key === active && "bg-brand-strong text-brand"
              )}
            >
              {fields[key]}
            </button>
          ))}
        </div>
      )}

      <div
        aria-hidden="true"
        className="col-span-5 grid grid-cols-subgrid gap-x-1 px-1.5 text-center text-meta font-medium text-subtle uppercase"
      >
        {FIELD_KEYS.map((key) => {
          const abbreviation = ABBREVIATIONS[key]

          // As size containers the labels have no intrinsic width, so only
          // the tokens size the shared columns.
          return (
            <span
              key={key}
              className={cn(
                "@container whitespace-nowrap",
                key === active && "text-brand"
              )}
            >
              {abbreviation ? (
                <>
                  <span className={abbreviation.full}>
                    {CRON_FIELDS[key].short}
                  </span>
                  <span className={abbreviation.short}>
                    {abbreviation.text}
                  </span>
                </>
              ) : (
                CRON_FIELDS[key].short
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}
