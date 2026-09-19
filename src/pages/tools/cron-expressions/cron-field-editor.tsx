import { useId, useState } from "react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { SegmentedControl } from "@/components/segmented-control"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import {
  CRON_FIELDS,
  FIELD_KEYS,
  fieldMode,
  isValidField,
  listValues,
  modeStartValue,
  valueLabel,
  type CronField,
  type CronFieldKey,
  type CronFields,
  type FieldMode,
} from "@/pages/tools/cron-expressions/cron"

const MODES: { value: FieldMode; label: string }[] = [
  { value: "every", label: "Every" },
  { value: "step", label: "Every N" },
  { value: "specific", label: "Specific" },
  { value: "range", label: "Range" },
]

const CHIP =
  "h-8 font-mono text-caption hover:bg-tool-control data-[state=on]:bg-brand-strong data-[state=on]:text-brand"

export function CronFieldEditor({
  fields,
  active,
  hover,
  onActiveChange,
  onHoverChange,
  onFieldChange,
  className,
}: {
  fields: CronFields
  active: CronFieldKey
  hover: CronFieldKey[]
  onActiveChange: (key: CronFieldKey) => void
  onHoverChange: (keys: CronFieldKey[]) => void
  onFieldChange: (key: CronFieldKey, value: string) => void
  className?: string
}) {
  return (
    <TabsPrimitive.Root
      value={active}
      onValueChange={(value) => onActiveChange(value as CronFieldKey)}
      className={cn("flex min-w-0 flex-col bg-tool-pane", className)}
    >
      <TabsPrimitive.List
        aria-label="Cron fields"
        className="grid grid-cols-5 border-b border-foreground/8"
      >
        {FIELD_KEYS.map((key) => {
          const isHighlighted = key === active || hover.includes(key)

          return (
            <TabsPrimitive.Trigger
              key={key}
              value={key}
              onPointerEnter={() => onHoverChange([key])}
              onPointerLeave={() => onHoverChange([])}
              className="flex min-w-0 flex-col items-start gap-1 border-b-2 border-transparent px-1.5 pt-3.5 pb-3 text-left transition-[background-color,border-color] duration-150 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset data-[state=active]:border-brand data-[state=active]:bg-tool-tab @md:px-3.5"
            >
              <span
                className={cn(
                  "max-w-full truncate text-meta font-medium text-subtle uppercase transition-colors duration-150",
                  isHighlighted && "text-brand"
                )}
              >
                {CRON_FIELDS[key].short}
              </span>
              <span
                className={cn(
                  "max-w-full truncate font-mono text-body-sm font-medium transition-colors duration-150",
                  isHighlighted && "text-brand"
                )}
              >
                {fields[key]}
              </span>
            </TabsPrimitive.Trigger>
          )
        })}
      </TabsPrimitive.List>

      <TabsPrimitive.Content
        value={active}
        className="flex flex-1 flex-col gap-4 px-4 py-5 outline-none @md:px-6"
      >
        <FieldPanel
          key={active}
          field={CRON_FIELDS[active]}
          value={fields[active]}
          onChange={(value) => onFieldChange(active, value)}
        />
      </TabsPrimitive.Content>
    </TabsPrimitive.Root>
  )
}

type FieldEditorProps = {
  field: CronField
  value: string
  onChange: (value: string) => void
}

function FieldPanel({ field, value, onChange }: FieldEditorProps) {
  const mode = fieldMode(value)

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-baseline gap-2">
          <span className="text-body-sm font-semibold">{field.label}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {field.min}-{field.max}
          </span>
        </h2>
        <SegmentedControl
          aria-label={`${field.label} format`}
          value={mode}
          onValueChange={(next) => onChange(modeStartValue(field, next))}
          options={MODES}
        />
      </div>

      <p className="text-caption text-pretty text-muted-foreground">
        {field.details}
      </p>

      {mode === "every" && (
        <div className="flex h-30 items-center justify-center rounded-xl border border-dashed border-foreground/12 px-4 text-center text-caption text-subtle">
          Matches every {field.unit} — the “{value}” wildcard.
        </div>
      )}
      {mode === "step" && (
        <StepPicker field={field} value={value} onChange={onChange} />
      )}
      {mode === "specific" && (
        <SpecificPicker field={field} value={value} onChange={onChange} />
      )}
      {mode === "range" && (
        <RangePicker field={field} value={value} onChange={onChange} />
      )}

      <div className="mt-auto flex flex-col gap-2 border-t border-foreground/6 pt-3.5">
        <RawValueInput field={field} value={value} onChange={onChange} />
        <ul aria-label="Examples" className="flex flex-col gap-[3px]">
          {field.examples.map(([code, meaning]) => {
            const isSelected = code === value

            return (
              <li key={code}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onChange(code)}
                  className={cn(
                    "-mx-2 flex h-7 w-[calc(100%+1rem)] items-center gap-3 rounded-md px-2 text-left text-caption transition-colors duration-150 outline-none hover:bg-tool-row-hover focus-visible:ring-3 focus-visible:ring-ring/50",
                    isSelected && "bg-brand-soft hover:bg-brand-soft"
                  )}
                >
                  <code
                    className={cn(
                      "min-w-16 font-mono text-xs text-foreground/80",
                      isSelected && "text-brand"
                    )}
                  >
                    {code}
                  </code>
                  <span className="truncate text-tool-muted">{meaning}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

function fieldValues(field: CronField) {
  return Array.from(
    { length: field.max - field.min + 1 },
    (_, index) => field.min + index
  )
}

function StepPicker({ field, value, onChange }: FieldEditorProps) {
  const step = Number(value.slice(2))
  // A typed step such as */7 joins the choices so it still shows as selected.
  const steps = field.steps.includes(step)
    ? field.steps
    : [...field.steps, step].sort((a, b) => a - b)

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-caption text-muted-foreground">
      <span className="mr-1">Every</span>
      <ToggleGroup
        type="single"
        value={String(step)}
        onValueChange={(next) => {
          if (next) onChange(`*/${next}`)
        }}
        spacing={1.5}
        aria-label={`Interval in ${field.unitPlural}`}
        className="flex-wrap"
      >
        {steps.map((option) => (
          <ToggleGroupItem
            key={option}
            value={String(option)}
            className={cn(
              CHIP,
              "min-w-11 rounded-md bg-tool-control px-2.5 text-foreground ring-1 ring-foreground/10 hover:ring-foreground/25 data-[state=on]:ring-brand"
            )}
          >
            {option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <span className="ml-1">{field.unitPlural}</span>
    </div>
  )
}

function SpecificPicker({ field, value, onChange }: FieldEditorProps) {
  const selected = [...new Set(listValues(value))].map(String)

  return (
    <ToggleGroup
      type="multiple"
      value={selected}
      onValueChange={(next) =>
        onChange(
          next.length > 0
            ? next
                .map(Number)
                .sort((a, b) => a - b)
                .join(",")
            : "*"
        )
      }
      spacing={1}
      aria-label={`Specific ${field.unitPlural}`}
      className="grid w-full grid-cols-[repeat(auto-fill,minmax(3rem,1fr))]"
    >
      {fieldValues(field).map((option) => (
        <ToggleGroupItem
          key={option}
          value={String(option)}
          className={cn(
            CHIP,
            "min-w-0 rounded-md bg-tool-control px-0 text-foreground/80 ring-1 ring-tool-control-ring hover:ring-foreground/25 aria-pressed:bg-brand-strong data-[state=on]:ring-transparent"
          )}
        >
          {valueLabel(field, option)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

function RangePicker({ field, value, onChange }: FieldEditorProps) {
  const [from, to] = value.split("-").map(Number)
  const setRange = (start: number, end: number) =>
    onChange(start <= end ? `${start}-${end}` : `${end}-${start}`)

  return (
    <div className="flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
      <span>From</span>
      <RangeSelect
        field={field}
        label={`First ${field.unit}`}
        value={from}
        onChange={(start) => setRange(start, to)}
      />
      <span>through</span>
      <RangeSelect
        field={field}
        label={`Last ${field.unit}`}
        value={to}
        onChange={(end) => setRange(from, end)}
      />
    </div>
  )
}

function RangeSelect({
  field,
  label,
  value,
  onChange,
}: {
  field: CronField
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <Select
      value={String(value)}
      onValueChange={(next) => onChange(Number(next))}
    >
      <SelectTrigger
        aria-label={label}
        className="min-w-20 rounded-md bg-tool-control font-mono text-caption text-foreground dark:bg-tool-control dark:hover:bg-tool-raised-hover"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" className="max-h-72">
        {fieldValues(field).map((option) => (
          <SelectItem
            key={option}
            value={String(option)}
            className="font-mono text-caption"
          >
            {valueLabel(field, option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function RawValueInput({ field, value, onChange }: FieldEditorProps) {
  const id = useId()
  // Invalid text stays in the box without touching the field; it is dropped
  // once the field changes elsewhere or the input loses focus.
  const [draft, setDraft] = useState<{ text: string; value: string } | null>(
    null
  )
  const text = draft?.value === value ? draft.text : value

  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="text-xs text-muted-foreground">
        Raw value
      </label>
      <Input
        id={id}
        value={text}
        aria-invalid={!isValidField(field.key, text.trim())}
        onChange={(event) => {
          const next = event.target.value
          const isValid = isValidField(field.key, next.trim())
          if (isValid) {
            onChange(next.trim())
          }
          setDraft({ text: next, value: isValid ? next.trim() : value })
        }}
        onBlur={() => setDraft(null)}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className="h-7.5 w-35 rounded-md bg-background px-2 font-mono text-caption md:text-caption dark:bg-background"
      />
    </div>
  )
}
