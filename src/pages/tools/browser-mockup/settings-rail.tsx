import type { ReactNode } from "react"
import { SlidersHorizontal } from "lucide-react"

import { eyebrowClass } from "@/components/editorial"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import {
  PADDING,
  WIDTH,
  type ExportScale,
  type MockupSettings,
} from "@/pages/tools/browser-mockup/mockup-settings"

export function SettingsRail({
  settings,
  onChange,
  exportWidth,
  className,
}: {
  settings: MockupSettings
  onChange: (patch: Partial<MockupSettings>) => void
  /** Width of the captured canvas in CSS pixels, before export scaling. */
  exportWidth: number
  className?: string
}) {
  return (
    <aside
      aria-label="Mockup settings"
      className={cn(
        "flex min-h-0 flex-col bg-tool-pane @3xl/mockup:w-72 @3xl/mockup:shrink-0 @3xl/mockup:overflow-y-auto @3xl/mockup:border-l",
        className
      )}
    >
      <div className="flex items-center gap-2 px-5 pt-3.5 pb-3 text-[0.8125rem] font-semibold">
        <SlidersHorizontal className="size-3.5 text-brand" />
        Mockup settings
      </div>

      <RailSection title="Window">
        <Segmented
          label="Frame style"
          value={settings.frame}
          onValueChange={(frame) => onChange({ frame })}
          options={[
            ["mac", "macOS"],
            ["minimal", "Minimal"],
          ]}
        />
        <Segmented
          label="Chrome colour"
          value={settings.chrome}
          onValueChange={(chrome) => onChange({ chrome })}
          options={[
            ["dark", "Dark"],
            ["light", "Light"],
          ]}
        />
        <RangeControl
          id="mockup-width"
          label="Width"
          range={WIDTH}
          value={settings.width}
          onValueChange={(width) => onChange({ width })}
        />
        <div className="flex flex-col gap-2">
          <label
            htmlFor="mockup-url"
            className="text-[0.8125rem] text-muted-foreground"
          >
            URL
          </label>
          <Input
            id="mockup-url"
            value={settings.url}
            spellCheck={false}
            autoComplete="off"
            onChange={(event) => onChange({ url: event.target.value })}
            className="border-foreground/12 bg-tool-control font-mono text-xs focus-visible:border-brand focus-visible:ring-brand/25 md:text-xs dark:bg-tool-control"
          />
        </div>
      </RailSection>

      <RailSection title="Backdrop">
        <Segmented
          label="Backdrop"
          value={settings.backdrop}
          onValueChange={(backdrop) => onChange({ backdrop })}
          options={[
            ["none", "None"],
            ["solid", "Solid"],
            ["gradient", "Gradient"],
          ]}
        />
        <RangeControl
          id="mockup-padding"
          label="Padding"
          range={PADDING}
          value={settings.padding}
          onValueChange={(padding) => onChange({ padding })}
        />
        <div className="flex flex-col gap-2">
          <span
            id="mockup-shadow"
            className="text-[0.8125rem] text-muted-foreground"
          >
            Shadow
          </span>
          <Segmented
            labelledBy="mockup-shadow"
            value={settings.shadow}
            onValueChange={(shadow) => onChange({ shadow })}
            options={[
              ["none", "None"],
              ["soft", "Soft"],
              ["deep", "Deep"],
            ]}
          />
        </div>
      </RailSection>

      <RailSection title="Export">
        <Segmented
          label="Export scale"
          value={String(settings.scale)}
          onValueChange={(scale) =>
            onChange({ scale: Number(scale) as ExportScale })
          }
          options={[
            ["1", "1x"],
            ["2", "2x"],
            ["3", "3x"],
          ]}
        />
        <p className="-mt-1 text-xs leading-[1.45] text-subtle">
          Exports at {exportWidth * settings.scale} px wide —{" "}
          {settings.scale === 1 ? "the same as" : `${settings.scale}×`} the
          canvas size.
        </p>
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

function Segmented<T extends string>({
  label,
  labelledBy,
  value,
  onValueChange,
  options,
}: {
  label?: string
  labelledBy?: string
  value: T
  onValueChange: (value: T) => void
  options: [T, string][]
}) {
  return (
    <ToggleGroup
      type="single"
      spacing={0.5}
      aria-label={label}
      aria-labelledby={labelledBy}
      value={value}
      // Radix clears the value when the active item is pressed again; keep it.
      onValueChange={(next) => next && onValueChange(next as T)}
      className="w-full bg-tool-control p-0.5 ring-1 ring-tool-control-ring"
    >
      {options.map(([optionValue, optionLabel]) => (
        <ToggleGroupItem
          key={optionValue}
          value={optionValue}
          className="h-7 flex-1 rounded-md text-[0.8125rem] text-muted-foreground transition-colors duration-150 hover:bg-transparent hover:text-foreground data-[state=on]:bg-brand/16 data-[state=on]:text-brand"
        >
          {optionLabel}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

function RangeControl({
  id,
  label,
  range,
  value,
  onValueChange,
}: {
  id: string
  label: string
  range: { min: number; max: number; step: number }
  value: number
  onValueChange: (value: number) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-[0.8125rem]">
        <label htmlFor={id} className="text-muted-foreground">
          {label}
        </label>
        <span className="tabular-nums">{value}px</span>
      </div>
      <Slider
        id={id}
        {...range}
        value={[value]}
        onValueChange={([next]) => onValueChange(next)}
        className="py-1.25 [&_[data-slot=slider-range]]:bg-brand [&_[data-slot=slider-thumb]]:border-brand [&_[data-slot=slider-thumb]]:ring-brand/30"
      />
    </div>
  )
}
