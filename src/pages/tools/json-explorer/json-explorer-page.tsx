import { useMemo, useState } from "react"
import { Braces, Copy, Eraser, FileJson, Search } from "lucide-react"
import { toast } from "sonner"

import { InstructionsCard } from "@/components/instructions-card"
import { OptionSelect } from "@/components/option-select"
import { Page, PageHeader } from "@/components/page"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import { Field, FieldLabel, FieldTitle } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { assetUrl, copyWithToast } from "@/lib/browser"
import { parseJson, queryJson } from "@/pages/tools/json-explorer/json-query"
import { JsonTree } from "@/pages/tools/json-explorer/json-tree"

const COLLAPSE_OPTIONS = [
  { value: "expand", label: "Expand all" },
  { value: "collapse", label: "Collapse all" },
  { value: "1", label: "Depth 1" },
  { value: "2", label: "Depth 2" },
  { value: "3", label: "Depth 3" },
]

const STRING_LIMIT_OPTIONS = [
  { value: "none", label: "No limit" },
  { value: "20", label: "20 characters" },
  { value: "40", label: "40 characters" },
  { value: "50", label: "50 characters" },
  { value: "100", label: "100 characters" },
]

const INDENT_OPTIONS = Array.from({ length: 10 }, (_, index) => ({
  value: String(index + 1),
  label: index + 1 === 4 ? "4 (default)" : String(index + 1),
}))

const DISPLAY_SWITCHES = [
  { key: "displayArrayKey", label: "Array keys" },
  { key: "displayDataTypes", label: "Data types" },
  { key: "displayObjectSize", label: "Object size" },
] as const

type DisplayKey = (typeof DISPLAY_SWITCHES)[number]["key"]

export default function JsonExplorerPage() {
  const [input, setInput] = useState("")
  const [queryPath, setQueryPath] = useState("")
  const [appliedQuery, setAppliedQuery] = useState("")
  const [collapse, setCollapse] = useState("expand")
  const [stringLimit, setStringLimit] = useState("none")
  const [indentWidth, setIndentWidth] = useState("4")
  const [display, setDisplay] = useState<Record<DisplayKey, boolean>>({
    displayArrayKey: false,
    displayDataTypes: false,
    displayObjectSize: false,
  })

  const result = useMemo(() => {
    if (!input.trim()) return null
    const parsed = parseJson(input)
    return parsed.ok ? queryJson(parsed.value, appliedQuery) : parsed
  }, [input, appliedQuery])

  const updateInput = (value: string) => {
    setInput(value)
    // A new document invalidates the previous query result.
    setAppliedQuery("")
  }

  const loadExample = async () => {
    try {
      const response = await fetch(assetUrl("data/example.json"))
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      updateInput(JSON.stringify(await response.json(), null, 4))
    } catch (error) {
      toast.error(
        `Couldn't load the example: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    }
  }

  const collapsed =
    collapse === "expand"
      ? false
      : collapse === "collapse"
        ? true
        : Number(collapse)

  return (
    <Page>
      <PageHeader />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <InstructionsCard
          title="How to Use"
          steps={[
            "Paste or load JSON data into the input field",
            "Use the JSON path to query specific data (e.g. user.name)",
            "Toggle display options for data types and object sizes",
            "Adjust collapse depth and string length limits",
            "View the formatted JSON output",
          ]}
        />
        <Card>
          <CardContent className="flex flex-col gap-5">
            <form
              onSubmit={(event) => {
                event.preventDefault()
                setAppliedQuery(queryPath)
              }}
            >
              <Field>
                <FieldLabel htmlFor="json-path">JSON path</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="json-path"
                    placeholder="Dot notation, e.g. user.name"
                    value={queryPath}
                    onChange={(event) => setQueryPath(event.target.value)}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
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
              </Field>
            </form>

            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {DISPLAY_SWITCHES.map(({ key, label }) => (
                <Field key={key} orientation="horizontal" className="w-auto">
                  <Switch
                    id={`json-${key}`}
                    checked={display[key]}
                    onCheckedChange={(checked) =>
                      setDisplay((previous) => ({
                        ...previous,
                        [key]: checked,
                      }))
                    }
                  />
                  <FieldLabel htmlFor={`json-${key}`}>{label}</FieldLabel>
                </Field>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <OptionSelect
                id="json-collapse"
                label="Collapse"
                value={collapse}
                onValueChange={setCollapse}
                options={COLLAPSE_OPTIONS}
              />
              <OptionSelect
                id="json-string-limit"
                label="String limit"
                value={stringLimit}
                onValueChange={setStringLimit}
                options={STRING_LIMIT_OPTIONS}
              />
              <OptionSelect
                id="json-indent"
                label="Indent width"
                value={indentWidth}
                onValueChange={setIndentWidth}
                options={INDENT_OPTIONS}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="json-input">Input</FieldLabel>
            <div className="flex gap-1">
              <IconButton label="Load example JSON" onClick={loadExample}>
                <FileJson />
              </IconButton>
              <IconButton
                label="Clear input"
                disabled={!input}
                onClick={() => updateInput("")}
              >
                <Eraser />
              </IconButton>
            </div>
          </div>
          <Textarea
            id="json-input"
            value={input}
            onChange={(event) => updateInput(event.target.value)}
            placeholder="Paste JSON here"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className="min-h-80 font-mono text-xs leading-relaxed md:text-xs"
          />
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <FieldTitle>Output</FieldTitle>
            <IconButton
              label="Copy output"
              disabled={!result?.ok}
              onClick={() =>
                result?.ok &&
                copyWithToast(
                  JSON.stringify(result.value, null, Number(indentWidth))
                )
              }
            >
              <Copy />
            </IconButton>
          </div>
          <div className="min-h-80 overflow-auto rounded-lg border bg-muted/40 p-3">
            {result === null ? (
              <Empty className="h-full">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Braces />
                  </EmptyMedia>
                  <EmptyDescription>
                    Paste JSON or load the example to explore it.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : result.ok ? (
              <JsonTree
                // Remount so a new collapse setting applies to every node.
                key={collapse}
                value={result.value}
                collapsed={collapsed}
                collapseStringsAfterLength={
                  stringLimit === "none" ? false : Number(stringLimit)
                }
                indentWidth={Number(indentWidth)}
                {...display}
              />
            ) : (
              <Alert variant="destructive">
                <AlertDescription>{result.error}</AlertDescription>
              </Alert>
            )}
          </div>
        </Field>
      </div>
    </Page>
  )
}

function IconButton({
  label,
  ...props
}: React.ComponentProps<typeof Button> & { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={label} {...props} />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
