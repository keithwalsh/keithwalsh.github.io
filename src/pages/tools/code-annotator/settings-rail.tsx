import type { ReactNode } from "react"
import { SlidersHorizontal } from "lucide-react"

import { eyebrowClass } from "@/components/editorial"
import { InlineCode } from "@/components/inline-code"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  DISPLAY_OPTIONS,
  LANGUAGE_OPTIONS,
  SYNTAX,
  writeComment,
  type AnnotatorState,
} from "@/pages/tools/code-annotator/annotator-settings"

/** The right-hand rail: the same shape as Browser Mockup's settings rail. */
export function SettingsRail({
  state,
  onChange,
  className,
}: {
  state: AnnotatorState
  onChange: (patch: Partial<AnnotatorState>) => void
  className?: string
}) {
  const { language, filename, options } = state

  return (
    <aside
      aria-label="Annotator settings"
      className={cn(
        "flex min-h-0 flex-col bg-tool-pane @3xl/annotator:w-72 @3xl/annotator:shrink-0 @3xl/annotator:overflow-y-auto @3xl/annotator:border-l",
        className
      )}
    >
      <div className="flex items-center gap-2 px-5 pt-3.5 pb-3 text-caption font-semibold">
        <SlidersHorizontal className="size-3.5 text-brand" />
        Annotator settings
      </div>

      <RailSection title="Code">
        <div className="flex flex-col gap-2">
          <Label htmlFor="code-language" className={railLabelClass}>
            Language
          </Label>
          <Select
            value={language}
            onValueChange={(value) => onChange({ language: value })}
          >
            <SelectTrigger id="code-language" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="code-filename" className={railLabelClass}>
            Filename
          </Label>
          <Input
            id="code-filename"
            value={filename}
            onChange={(event) => onChange({ filename: event.target.value })}
            placeholder="Optional"
            spellCheck={false}
            autoComplete="off"
            className="border-foreground/12 bg-tool-control font-mono text-xs focus-visible:border-brand focus-visible:ring-brand/25 md:text-xs dark:bg-tool-control"
          />
        </div>
      </RailSection>

      <RailSection title="Display">
        {DISPLAY_OPTIONS.map(({ key, id, label }) => (
          <div key={key} className="flex items-center justify-between gap-3">
            <Label htmlFor={id} className={railLabelClass}>
              {label}
            </Label>
            <Switch
              id={id}
              checked={options[key]}
              onCheckedChange={(checked) =>
                onChange({ options: { ...options, [key]: checked } })
              }
            />
          </div>
        ))}
      </RailSection>

      <RailSection title="Syntax">
        <dl className="flex flex-col gap-3.5">
          {SYNTAX.map(({ comment, markers, effect }) => (
            <div key={effect} className="flex flex-col gap-1.5">
              <dt className="flex flex-wrap gap-1.5">
                {markers.map((marker) => (
                  <InlineCode key={marker}>
                    {comment ? writeComment(language, marker) : marker}
                  </InlineCode>
                ))}
              </dt>
              <dd className="text-xs leading-[1.45] text-subtle">{effect}</dd>
            </div>
          ))}
        </dl>
      </RailSection>
    </aside>
  )
}

const railLabelClass = "text-caption font-normal text-muted-foreground"

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
