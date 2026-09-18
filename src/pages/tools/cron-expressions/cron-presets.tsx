import { eyebrowClass } from "@/components/editorial"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  COMMON_EXPRESSIONS,
  SPECIAL_CHARACTERS,
} from "@/pages/tools/cron-expressions/cron"

export function CronPresets({
  expression,
  onSelect,
  className,
}: {
  expression: string
  onSelect: (cron: string) => void
  className?: string
}) {
  return (
    <section
      aria-labelledby="cron-presets-heading"
      className={cn("flex flex-col gap-2", className)}
    >
      <h2 id="cron-presets-heading" className={eyebrowClass}>
        Presets
      </h2>
      <div className="grid gap-1 @sm:grid-cols-2">
        {COMMON_EXPRESSIONS.map((preset) => {
          const isSelected = preset.cron === expression

          return (
            <button
              key={preset.cron}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(preset.cron)}
              className={cn(
                "flex h-8.5 items-center justify-between gap-2 rounded-md bg-tool-raised px-2.5 text-left text-[0.8125rem] text-foreground/90 ring-1 ring-foreground/8 transition-colors duration-150 outline-none hover:bg-tool-raised-hover focus-visible:ring-3 focus-visible:ring-ring/50",
                isSelected &&
                  "bg-brand-soft text-brand ring-brand hover:bg-brand-soft"
              )}
            >
              <span className="truncate">{preset.name}</span>
              <span className="font-mono text-xs whitespace-nowrap text-tool-muted">
                {preset.cron}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function CronLegend() {
  return (
    <ul
      aria-label="Special characters"
      className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-tool-muted"
    >
      {SPECIAL_CHARACTERS.map((character) => (
        <li key={character.symbol}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                tabIndex={0}
                className="inline-flex items-center gap-1.5 rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <code className="inline-flex size-4.5 items-center justify-center rounded-[5px] bg-tool-symbol font-mono text-xs font-semibold text-foreground/90">
                  {character.symbol}
                </code>
                {character.name}
              </span>
            </TooltipTrigger>
            <TooltipContent>{character.description}</TooltipContent>
          </Tooltip>
        </li>
      ))}
    </ul>
  )
}
