import { useEffect, useRef, useState } from "react"
import { Check, Copy, Dices } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { copyToClipboard } from "@/lib/browser"
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
  "size-11 rounded-lg border-0 bg-cron-raised ring-1 ring-foreground/8 hover:bg-cron-raised-hover dark:hover:bg-cron-raised-hover"

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
  const [copied, setCopied] = useState(false)
  const copiedTimeout = useRef<number>(undefined)
  const pasteToggle = useRef<HTMLButtonElement>(null)

  useEffect(() => () => window.clearTimeout(copiedTimeout.current), [])

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

  const copy = async () => {
    if (!(await copyToClipboard(expression))) {
      toast.error("Copy failed. Use Paste expression to copy it by hand.")
      return
    }
    setCopied(true)
    window.clearTimeout(copiedTimeout.current)
    copiedTimeout.current = window.setTimeout(() => setCopied(false), 1200)
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
          className="col-span-5 h-11 rounded-lg bg-background px-3 font-mono text-lg tracking-[0.04em] md:text-lg dark:bg-background"
        />
      ) : (
        <div
          role="group"
          aria-label="Expression fields"
          className="col-span-5 grid h-11 grid-cols-subgrid items-center gap-x-1 rounded-lg bg-cron-raised px-1.5 ring-1 ring-foreground/8"
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
                "h-8 min-w-0 truncate rounded-[7px] px-2 text-center font-mono text-lg font-medium transition-colors duration-150 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                hover.includes(key) && "bg-cron-accent-soft text-cron-accent",
                key === active && "bg-cron-accent-strong text-cron-accent"
              )}
            >
              {fields[key]}
            </button>
          ))}
        </div>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Random expression"
            onClick={() => {
              setRolls((count) => count + 1)
              onFieldsChange(randomCronFields())
            }}
            className={ICON_BUTTON}
          >
            <Dices
              key={rolls}
              className={cn(
                rolls > 0 && "motion-safe:animate-[spin_0.5s_ease-in-out]"
              )}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Random expression</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Copy expression"
            onClick={copy}
            className={ICON_BUTTON}
          >
            {copied ? (
              <Check strokeWidth={2.5} className="text-cron-success" />
            ) : (
              <Copy />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy expression</TooltipContent>
      </Tooltip>

      <div
        aria-hidden="true"
        className="col-span-5 grid grid-cols-subgrid gap-x-1 px-1.5 text-center text-[0.6875rem] font-medium tracking-widest text-cron-subtle uppercase"
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
        className="col-span-2 h-6 rounded-sm text-xs text-muted-foreground underline decoration-foreground/25 underline-offset-3 transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {isPasting ? "Done" : "Paste expression"}
      </button>

      <span role="status" className="sr-only">
        {copied ? "Expression copied" : ""}
      </span>
    </div>
  )
}
