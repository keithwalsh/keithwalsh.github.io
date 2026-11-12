import type { ReactNode } from "react"
import { SlidersHorizontal } from "lucide-react"

import { eyebrowClass } from "@/components/editorial"
import { InlineCode } from "@/components/inline-code"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  DELIMITERS,
  KEYS,
  OUTPUT_OPTIONS,
  type OutputOptions,
} from "@/pages/tools/markdown-table/table-settings"

/** The right-hand rail: the same shape as JSON Explorer's settings rail. */
export function SettingsRail({
  options,
  onChange,
  className,
}: {
  options: OutputOptions
  onChange: (options: OutputOptions) => void
  className?: string
}) {
  return (
    <aside
      aria-label="Table settings"
      className={cn(
        "flex min-h-0 flex-col bg-tool-pane @3xl/table:w-72 @3xl/table:shrink-0 @3xl/table:overflow-y-auto @3xl/table:border-l",
        className
      )}
    >
      <div className="flex items-center gap-2 px-5 pt-3.5 pb-3 text-caption font-semibold">
        <SlidersHorizontal className="size-3.5 text-brand" />
        Table settings
      </div>

      <RailSection title="Output">
        {OUTPUT_OPTIONS.map(({ key, id, label }) => (
          <div key={key} className="flex items-center justify-between gap-3">
            <Label
              htmlFor={id}
              className="text-caption font-normal text-muted-foreground"
            >
              {label}
            </Label>
            <Switch
              id={id}
              checked={options[key]}
              onCheckedChange={(checked) =>
                onChange({ ...options, [key]: checked })
              }
            />
          </div>
        ))}
      </RailSection>

      <RailSection title="Keys">
        <dl className="flex flex-col gap-3.5">
          {KEYS.map(({ keys, effect }) => (
            <div key={keys} className="flex flex-col gap-1.5">
              <dt>
                <InlineCode>{keys}</InlineCode>
              </dt>
              <dd className="text-xs leading-[1.45] text-subtle">{effect}</dd>
            </div>
          ))}
        </dl>
      </RailSection>

      <RailSection title="Delimiter row">
        <dl className="flex flex-col gap-2.5">
          {DELIMITERS.map(({ syntax, alignment }) => (
            <div
              key={syntax}
              className="flex items-center justify-between gap-3"
            >
              <dt>
                <InlineCode>{syntax}</InlineCode>
              </dt>
              <dd className="text-xs text-subtle">{alignment}</dd>
            </div>
          ))}
        </dl>
      </RailSection>
    </aside>
  )
}

function RailSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="border-t border-foreground/8 px-5 py-4">
      <h2 className={cn(eyebrowClass, "mb-3")}>{title}</h2>
      <div className="flex flex-col gap-3.5">{children}</div>
    </section>
  )
}
