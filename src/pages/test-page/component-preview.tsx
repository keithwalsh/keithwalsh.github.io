import { useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"

import { CodeHighlighter } from "@/components/code-highlighter"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type PropDefinition = {
  name: string
  description: string
  type: string
  defaultValue: string | number | boolean
  controlType: "boolean" | "number" | "text" | "select" | "callback" | "object"
  options?: string[]
  min?: number
  max?: number
  step?: number
}

export type PreviewProps = Record<string, unknown>

/** Storybook-style preview: live component, expandable code and a props table with controls. */
export function ComponentPreview({
  title,
  description,
  codeExample,
  propDefinitions,
  renderComponent,
  initialProps = {},
}: {
  title: string
  description: string
  codeExample: string
  propDefinitions: PropDefinition[]
  renderComponent: (props: PreviewProps) => ReactNode
  initialProps?: PreviewProps
}) {
  const [props, setProps] = useState<PreviewProps>(() => {
    const initial = { ...initialProps }
    for (const prop of propDefinitions) {
      const isControllable =
        prop.controlType !== "callback" && prop.controlType !== "object"
      if (isControllable && !(prop.name in initial)) {
        initial[prop.name] = prop.defaultValue
      }
    }
    return initial
  })
  const [isCodeOpen, setIsCodeOpen] = useState(false)

  const setProp = (name: string, value: unknown) =>
    setProps((previous) => ({ ...previous, [name]: value }))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          {title}
        </h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Collapsible
        open={isCodeOpen}
        onOpenChange={setIsCodeOpen}
        className="overflow-hidden rounded-xl border"
      >
        <div className="flex justify-center overflow-x-auto bg-background p-6">
          {renderComponent(props)}
        </div>
        <div className="flex justify-end border-t bg-muted/30 px-2 py-1.5">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isCodeOpen ? "Collapse code" : "Expand code"}
              <ChevronDown
                data-icon="inline-end"
                className={cn(
                  "transition-transform",
                  isCodeOpen && "rotate-180"
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="border-t">
          <CodeHighlighter
            code={codeExample}
            language="tsx"
            showLineNumbers
            annotations={false}
            wrap={false}
            className="rounded-none border-0"
          />
        </CollapsibleContent>
      </Collapsible>

      <section className="flex flex-col gap-3">
        <h3 className="font-heading text-base font-semibold">Props</h3>
        <div className="overflow-hidden rounded-xl border">
          <Table className="min-w-[760px] table-fixed">
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[16%]">Name</TableHead>
                <TableHead className="w-[30%]">Description</TableHead>
                <TableHead className="w-[18%]">Type</TableHead>
                <TableHead className="w-[14%]">Default</TableHead>
                <TableHead className="w-[22%]">Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propDefinitions.map((prop) => (
                <TableRow key={prop.name}>
                  <TableCell className="font-mono text-xs font-semibold">
                    {prop.name}
                  </TableCell>
                  <TableCell className="whitespace-normal text-muted-foreground">
                    {prop.description}
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <code className="rounded-sm border bg-muted px-1.5 py-0.5 font-mono text-xs">
                      {prop.type}
                    </code>
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <code className="rounded-sm border bg-muted px-1.5 py-0.5 font-mono text-xs">
                      {String(prop.defaultValue)}
                    </code>
                  </TableCell>
                  <TableCell>
                    <PropControl
                      prop={prop}
                      value={props[prop.name]}
                      onChange={(value) => setProp(prop.name, value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}

function PropControl({
  prop,
  value,
  onChange,
}: {
  prop: PropDefinition
  value: unknown
  onChange: (value: unknown) => void
}) {
  switch (prop.controlType) {
    case "boolean":
      return (
        <div className="flex items-center gap-2 text-xs">
          <span className={cn(value ? "text-muted-foreground" : "font-medium")}>
            False
          </span>
          <Switch
            aria-label={prop.name}
            checked={Boolean(value)}
            onCheckedChange={onChange}
          />
          <span className={cn(value ? "font-medium" : "text-muted-foreground")}>
            True
          </span>
        </div>
      )
    case "number": {
      const min = prop.min ?? 0
      const max = prop.max ?? 800
      const step = prop.step ?? 1
      const current = typeof value === "number" ? value : min
      return (
        <div className="flex items-center gap-3">
          <Slider
            aria-label={prop.name}
            min={min}
            max={max}
            step={step}
            value={[current]}
            onValueChange={([next]) => onChange(next)}
            className="flex-1"
          />
          <Input
            type="number"
            aria-label={`${prop.name} value`}
            min={min}
            max={max}
            step={step}
            value={current}
            onChange={(event) =>
              onChange(
                event.target.value === "" ? min : Number(event.target.value)
              )
            }
            onBlur={() => onChange(Math.min(max, Math.max(min, current)))}
            className="h-7 w-16 px-1.5 text-xs md:text-xs"
          />
        </div>
      )
    }
    case "text":
      return (
        <Input
          aria-label={prop.name}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
          className="h-7 text-xs md:text-xs"
        />
      )
    case "select":
      return (
        <Select value={String(value ?? "")} onValueChange={onChange}>
          <SelectTrigger aria-label={prop.name} size="sm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {prop.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    default:
      return <span className="text-muted-foreground">—</span>
  }
}
