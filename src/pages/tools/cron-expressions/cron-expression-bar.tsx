import { useRef, useState } from "react"
import { Copy, Dices } from "lucide-react"

import { linkClass } from "@/components/editorial"
import { IconButton } from "@/components/icon-button"
import { Input } from "@/components/ui/input"
import { copyWithToast } from "@/lib/browser"
import { cn } from "@/lib/utils"
import {
  CRON_FIELDS,
  FIELD_KEYS,
  formatCronExpression,
  parseCronExpression,
  randomCronFields,
  type CronFieldKey,
  type CronFields,
} from "@/pages/tools/cron-expressions/cron"

const ICON_BUTTON =
  "size-11 rounded-lg border-0 bg-tool-raised ring-1 ring-foreground/8 hover:bg-tool-raised-hover dark:hover:bg-tool-raised-hover"

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

export function CronExpressionBar({
  fields,
  active,
  hover,
  onActiveChange,
  onHoverChange,
  onFieldsChange,
}: {
  fields: CronFields
  active: CronFieldKey
  hover: CronFieldKey[]
  onActiveChange: (key: CronFieldKey) => void
  onHoverChange: (keys: CronFieldKey[]) => void
  onFieldsChange: (fields: CronFields) => void
}) {
  const expression = formatCronExpression(fields)
  const [isPasting, setIsPasting] = useState(false)
  // Typed text is shown only while it still matches the fields, so a preset
  // or random roll made meanwhile replaces it.
  const [draft, setDraft] = useState<{
    text: string
    expression: string
  } | null>(null)
  // Changing the key remounts the dice icon so its spin replays on every roll.
  const [rolls, setRolls] = useState(0)
  const pasteToggle = useRef<HTMLButtonElement>(null)

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

  const togglePasting = () => {
    setIsPasting((current) => !current)
    setDraft(null)
  }

  return (
    // Tokens and labels share subgrid columns sized by each token's value, so
    // longer values like */15 get room without breaking the label alignment.
    <div className="grid grid-cols-[repeat(5,minmax(0,auto))_2.75rem_2.75rem] gap-x-2 gap-y-3.5">
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
              togglePasting()
              pasteToggle.current?.focus()
            }
          }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="col-span-5 h-11 rounded-lg bg-background px-3 font-mono text-lg tracking-wider md:text-lg dark:bg-background"
        />
      ) : (
        <div
          role="group"
          aria-label="Expression fields"
          className="col-span-5 grid h-11 grid-cols-subgrid items-center gap-x-1 rounded-lg bg-tool-raised px-1.5 ring-1 ring-foreground/8"
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
                "h-8 min-w-0 truncate rounded-md px-2 text-center font-mono text-lg font-medium transition-colors duration-150 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                hover.includes(key) && "bg-brand-soft text-brand",
                key === active && "bg-brand-strong text-brand"
              )}
            >
              {fields[key]}
            </button>
          ))}
        </div>
      )}

      <IconButton
        label="Random expression"
        size="icon"
        onClick={() => {
          setRolls((count) => count + 1)
          onFieldsChange(randomCronFields())
        }}
        className={ICON_BUTTON}
      >
        <Dices
          key={rolls}
          className={cn(rolls > 0 && "motion-safe:animate-roll")}
        />
      </IconButton>
      <IconButton
        label="Copy expression"
        size="icon"
        onClick={() => copyWithToast(expression, "Expression copied")}
        className={ICON_BUTTON}
      >
        <Copy />
      </IconButton>

      <div
        aria-hidden="true"
        className="col-span-5 grid grid-cols-subgrid gap-x-1 px-1.5 text-center text-meta font-medium text-subtle uppercase"
      >
        {FIELD_KEYS.map((key) => {
          const abbreviation = ABBREVIATIONS[key]

          // As size containers the labels have no intrinsic width, so only
          // the tokens size the shared columns.
          return (
            <span key={key} className="@container whitespace-nowrap">
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
      <button
        ref={pasteToggle}
        type="button"
        onClick={togglePasting}
        className={cn(
          linkClass,
          "col-span-2 h-6 rounded-sm text-xs text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        )}
      >
        {isPasting ? "Done" : "Paste expression"}
      </button>
    </div>
  )
}
