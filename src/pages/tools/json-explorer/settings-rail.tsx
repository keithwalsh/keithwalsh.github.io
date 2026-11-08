import type { ReactNode } from "react"
import { Search, SlidersHorizontal } from "lucide-react"

import { eyebrowClass } from "@/components/editorial"
import { InlineCode } from "@/components/inline-code"
import { SegmentedControl } from "@/components/segmented-control"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  DISPLAY_OPTIONS,
  EXPAND_OPTIONS,
  INDENT,
  PATH_SYNTAX,
  STRING_LIMIT_OPTIONS,
  type ExplorerSettings,
} from "@/pages/tools/json-explorer/explorer-settings"

/** The right-hand rail: the same shape as Code Annotator's settings rail. */
export function SettingsRail({
  settings,
  onChange,
  draft,
  onDraftChange,
  onQuery,
  queryError,
  className,
}: {
  settings: ExplorerSettings
  onChange: (patch: Partial<ExplorerSettings>) => void
  /** The path as typed, before it is run. */
  draft: string
  onDraftChange: (draft: string) => void
  onQuery: () => void
  /** Shown in place of the hint when the query matches nothing. */
  queryError: string | null
  className?: string
}) {
  const { display } = settings

  return (
    <aside
      aria-label="Explorer settings"
      className={cn(
        "flex min-h-0 flex-col bg-tool-pane @3xl/explorer:w-72 @3xl/explorer:shrink-0 @3xl/explorer:overflow-y-auto @3xl/explorer:border-l",
        className
      )}
    >
      <div className="flex items-center gap-2 px-5 pt-3.5 pb-3 text-caption font-semibold">
        <SlidersHorizontal className="size-3.5 text-brand" />
        Explorer settings
      </div>

      <RailSection title="Query">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            onQuery()
          }}
          className="flex flex-col gap-2"
        >
          <Label htmlFor="json-path" className={railLabelClass}>
            JSON path
          </Label>
          <InputGroup className="border-foreground/12 bg-tool-control has-[[data-slot=input-group-control]:focus-visible]:border-brand has-[[data-slot=input-group-control]:focus-visible]:ring-brand/25 dark:bg-tool-control">
            <InputGroupAddon className="pr-0">
              <InputGroupText className="font-mono text-xs text-subtle">
                $.
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="json-path"
              value={draft}
              onChange={(event) => onDraftChange(event.target.value)}
              placeholder="object.first-child"
              aria-invalid={queryError ? true : undefined}
              aria-describedby="json-path-hint"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="pl-0.5! font-mono text-xs md:text-xs"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="submit"
                size="icon-xs"
                aria-label="Run query"
              >
                <Search />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <p
            id="json-path-hint"
            className={cn(
              "text-xs leading-[1.45]",
              queryError ? "text-destructive" : "text-subtle"
            )}
          >
            {queryError ??
              "Dot notation, e.g. object.first-child or array.0. Or click a key in the tree."}
          </p>
        </form>
      </RailSection>

      <RailSection title="Tree">
        <div className="flex flex-col gap-2">
          <span id="json-expand" className={railLabelClass}>
            Expand to depth
          </span>
          <SegmentedControl
            aria-labelledby="json-expand"
            value={settings.expand}
            onValueChange={(expand) => onChange({ expand })}
            options={EXPAND_OPTIONS}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span id="json-string-limit" className={railLabelClass}>
            Shorten strings after
          </span>
          <SegmentedControl
            aria-labelledby="json-string-limit"
            value={settings.stringLimit}
            onValueChange={(stringLimit) => onChange({ stringLimit })}
            options={STRING_LIMIT_OPTIONS}
            className="w-full tabular-nums"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-caption">
            <label htmlFor="json-indent" className="text-muted-foreground">
              Indent
            </label>
            <span className="tabular-nums">
              {settings.indent} {settings.indent === 1 ? "space" : "spaces"}
            </span>
          </div>
          <Slider
            id="json-indent"
            {...INDENT}
            value={[settings.indent]}
            onValueChange={([indent = settings.indent]) => onChange({ indent })}
            className="py-1.25 [&_[data-slot=slider-range]]:bg-brand [&_[data-slot=slider-thumb]]:border-brand [&_[data-slot=slider-thumb]]:ring-brand/30"
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
              checked={display[key]}
              onCheckedChange={(checked) =>
                onChange({ display: { ...display, [key]: checked } })
              }
            />
          </div>
        ))}
      </RailSection>

      <RailSection title="Path syntax">
        <dl className="flex flex-col gap-3.5">
          {PATH_SYNTAX.map(({ example, effect }) => (
            <div key={example} className="flex flex-col gap-1.5">
              <dt>
                <InlineCode>{example}</InlineCode>
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
