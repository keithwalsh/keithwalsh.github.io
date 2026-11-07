import { useState } from "react"
import {
  ClipboardPaste,
  Clock,
  Copy,
  Dices,
  SlidersHorizontal,
} from "lucide-react"

import { brandFillClass } from "@/components/editorial"
import { Button } from "@/components/ui/button"
import { copyWithToast } from "@/lib/browser"
import { cn } from "@/lib/utils"
import {
  DEFAULT_FIELDS,
  describeSegments,
  formatCronExpression,
  parseCronExpression,
  randomCronFields,
  type CronFieldKey,
  type CronFields,
} from "@/pages/tools/cron-expressions/cron"
import { CronExpressionBar } from "@/pages/tools/cron-expressions/cron-expression-bar"
import { CronFieldEditor } from "@/pages/tools/cron-expressions/cron-field-editor"
import {
  CronLegend,
  CronPresets,
} from "@/pages/tools/cron-expressions/cron-presets"
import { CronSentence } from "@/pages/tools/cron-expressions/cron-sentence"

/** The schedule in words on one line, for the toolbar chip. */
function describeInline(fields: CronFields) {
  return describeSegments(fields)
    .map((segment, index) => {
      if (index === 0) return segment.text
      return (segment.text.startsWith("and ") ? " " : ", ") + segment.text
    })
    .join("")
}

export default function CronExpressionsPage() {
  const [fields, setFields] = useState<CronFields>(DEFAULT_FIELDS)
  const [active, setActive] = useState<CronFieldKey>("minutes")
  // Hovering a token, tab or sentence segment highlights its fields in all three.
  const [hover, setHover] = useState<CronFieldKey[]>([])
  const [isPasting, setIsPasting] = useState(false)
  // Changing the key remounts the dice icon so its spin replays on every roll.
  const [rolls, setRolls] = useState(0)

  const expression = formatCronExpression(fields)

  return (
    // Breakpoints follow the page's own width, not the viewport's, so the rail
    // still fits beside the canvas when the site sidebar is open.
    <div className="@container/cron flex flex-1 flex-col">
      <div className="flex flex-1 flex-col @3xl/cron:h-[calc(100svh-3.5rem)] @3xl/cron:flex-none">
        <div className="flex h-15 shrink-0 items-center gap-3 border-b px-4 @3xl/cron:px-5">
          <div className="flex min-w-0 items-center gap-2 rounded-full bg-card py-1 pr-2.5 pl-2 text-caption text-muted-foreground ring-1 ring-tool-control-ring dark:bg-card">
            <Clock className="size-3.5 shrink-0" />
            <span className="shrink-0 font-mono text-xs tracking-wider text-foreground">
              {expression}
            </span>
            <span className="truncate @max-5xl/cron:hidden">
              {describeInline(fields)}
            </span>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setRolls((count) => count + 1)
                setFields(randomCronFields())
              }}
            >
              <Dices
                key={rolls}
                className={cn(rolls > 0 && "motion-safe:animate-roll")}
              />
              <span className="@max-2xl/cron:sr-only">Random</span>
            </Button>
            <Button
              variant="outline"
              aria-pressed={isPasting}
              onClick={() => setIsPasting((current) => !current)}
              className={cn(isPasting && "bg-accent")}
            >
              <ClipboardPaste />
              <span className="@max-2xl/cron:sr-only">
                {isPasting ? "Done" : "Paste expression"}
              </span>
            </Button>
            <Button
              onClick={() => copyWithToast(expression, "Expression copied")}
              className={cn(brandFillClass, "px-3 font-semibold")}
            >
              <Copy />
              <span className="@max-2xl/cron:sr-only">Copy expression</span>
            </Button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col @3xl/cron:flex-row-reverse">
          {/* Its own size container, so the editor's tab strip and padding
              follow the rail's width rather than the page's. */}
          <aside
            aria-label="Field editor"
            className="@container flex min-h-0 flex-col bg-tool-pane @max-3xl/cron:order-last @max-3xl/cron:border-t @3xl/cron:w-96 @3xl/cron:shrink-0 @3xl/cron:overflow-y-auto @3xl/cron:border-l"
          >
            <div className="flex items-center gap-2 px-5 pt-3.5 pb-3 text-caption font-semibold">
              <SlidersHorizontal className="size-3.5 text-brand" />
              Field editor
            </div>
            <CronFieldEditor
              fields={fields}
              active={active}
              hover={hover}
              onActiveChange={setActive}
              onHoverChange={setHover}
              onFieldChange={(key, value) =>
                setFields((current) => ({ ...current, [key]: value }))
              }
              className="flex-1 border-t border-foreground/8"
            />
          </aside>

          {/* The schedule sits on the same dotted canvas as Browser Mockup's
              preview. Also a size container, so the presets grid follows it. */}
          <section
            aria-label="Schedule"
            className="@container relative flex min-h-[32rem] min-w-0 flex-1 flex-col items-center overflow-auto bg-[color:oklch(0.97_0_0)] bg-[image:radial-gradient(oklch(0_0_0/7%)_1px,transparent_1px)] bg-size-[16px_16px] px-6 pt-8 pb-14 @3xl/cron:min-h-0 @3xl/cron:px-12 dark:bg-tool-raised dark:bg-[image:radial-gradient(oklch(1_0_0/7%)_1px,transparent_1px)]"
          >
            {/* Centred in the space above the schedule; the matching spacer
                below keeps the schedule block in the middle. */}
            <div className="flex w-full max-w-2xl flex-1 items-center">
              <header className="flex flex-col gap-2.5 py-4">
                <h1 className="font-heading text-title font-semibold uppercase">
                  Cron Expressions
                </h1>
                <p className="max-w-[52ch] text-body-sm text-pretty text-muted-foreground">
                  Build, check and decode cron schedules. Pick a field on the
                  right, or start from a preset below.
                </p>
              </header>
            </div>

            <div className="flex w-full max-w-2xl flex-col gap-9">
              <div className="flex flex-col gap-5">
                <CronSentence
                  fields={fields}
                  active={active}
                  hover={hover}
                  onHoverChange={setHover}
                />
                <CronExpressionBar
                  fields={fields}
                  active={active}
                  hover={hover}
                  isPasting={isPasting}
                  onPastingChange={setIsPasting}
                  onActiveChange={setActive}
                  onHoverChange={setHover}
                  onFieldsChange={setFields}
                />
              </div>

              <CronPresets
                expression={expression}
                onSelect={(cron) =>
                  setFields(parseCronExpression(cron) ?? fields)
                }
              />
            </div>

            <div aria-hidden="true" className="w-full flex-1" />

            <div className="absolute bottom-3.5 left-4.5 @max-xl/cron:hidden">
              <CronLegend />
            </div>
            <p className="pointer-events-none absolute right-4.5 bottom-3.5 font-mono text-2xs text-subtle">
              5 fields · standard cron
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
