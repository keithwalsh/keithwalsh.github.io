import {
  Fragment,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  ArrowLeft,
  Braces,
  CircleAlert,
  Copy,
  Eraser,
  FileJson,
  FileUp,
  MousePointerClick,
  Upload,
  WandSparkles,
} from "lucide-react"
import { toast } from "sonner"

import { DropZone } from "@/components/drop-zone"
import { brandFillClass } from "@/components/editorial"
import { IconButton } from "@/components/icon-button"
import { InlineCode } from "@/components/inline-code"
import { InputResizeHandle } from "@/components/input-resize-handle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Textarea } from "@/components/ui/textarea"
import { assetUrl, copyWithToast, readStoredObject } from "@/lib/browser"
import { readInputHeight } from "@/lib/input-height"
import { cn } from "@/lib/utils"
import {
  collapsedFor,
  DEFAULT_SETTINGS,
  DISPLAY_OPTIONS,
  EXPAND_OPTIONS,
  INDENT,
  STRING_LIMIT_OPTIONS,
  stringLimitFor,
  type DisplayOptions,
  type ExplorerSettings,
} from "@/pages/tools/json-explorer/explorer-settings"
import {
  describeValue,
  formatPath,
  measureJson,
  parseJson,
  parsePath,
  resolvePath,
  type JsonPath,
} from "@/pages/tools/json-explorer/json-query"
import { JsonTree } from "@/pages/tools/json-explorer/json-tree"
import { SettingsRail } from "@/pages/tools/json-explorer/settings-rail"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const STORAGE_KEY = "json-explorer-settings"

// Settings (not the document) persist between visits. Anything unrecognised
// in storage falls back to its default.
function loadSettings(): ExplorerSettings {
  const saved = readStoredObject(STORAGE_KEY)
  if (!saved) return DEFAULT_SETTINGS
  const pick = <T extends string>(
    value: unknown,
    options: readonly { value: T }[],
    fallback: T
  ) => options.find((option) => option.value === value)?.value ?? fallback
  const display: Record<string, unknown> =
    saved.display && typeof saved.display === "object"
      ? { ...saved.display }
      : {}
  const indent =
    typeof saved.indent === "number" && Number.isFinite(saved.indent)
      ? Math.min(INDENT.max, Math.max(INDENT.min, Math.round(saved.indent)))
      : DEFAULT_SETTINGS.indent
  return {
    expand: pick(saved.expand, EXPAND_OPTIONS, DEFAULT_SETTINGS.expand),
    stringLimit: pick(
      saved.stringLimit,
      STRING_LIMIT_OPTIONS,
      DEFAULT_SETTINGS.stringLimit
    ),
    indent,
    display: Object.fromEntries(
      DISPLAY_OPTIONS.map(({ key }) => {
        const value = display[key]
        return [
          key,
          typeof value === "boolean" ? value : DEFAULT_SETTINGS.display[key],
        ]
      })
    ) as DisplayOptions,
    inputHeight: readInputHeight(
      saved.inputHeight,
      DEFAULT_SETTINGS.inputHeight
    ),
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const plural = (count: number, noun: string) =>
  `${count} ${noun}${count === 1 ? "" : "s"}`

export default function JsonExplorerPage() {
  const [text, setText] = useState("")
  // The opened file's name; null for pasted or typed JSON.
  const [source, setSource] = useState<string | null>(null)
  const [path, setPath] = useState<JsonPath>([])
  const [draft, setDraft] = useState("")
  const [settings, setSettings] = useState(loadSettings)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // The input panel reads its height from this variable. A drag writes it
  // here directly and only commits to settings once the pointer lifts.
  const inputRef = useRef<HTMLElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // Storage can be unavailable (private mode, blocked site data).
    }
  }, [settings])

  // A query swaps in a different subtree, so show it from the top rather
  // than wherever the previous tree was scrolled to.
  const canvasRef = useRef<HTMLDivElement>(null)
  const pathKey = formatPath(path)
  useEffect(() => {
    canvasRef.current?.scrollTo({ top: 0 })
  }, [pathKey])

  const updateSettings = (patch: Partial<ExplorerSettings>) =>
    setSettings((current) => ({ ...current, ...patch }))

  // Parsing and drawing a large document on every keystroke makes typing
  // lag, so everything below the textarea trails it by a render when busy.
  const deferredText = useDeferredValue(text)
  const doc = useMemo(() => {
    if (!deferredText.trim()) return null
    const parsed = parseJson(deferredText)
    return {
      parsed,
      lines: deferredText.split("\n").length,
      bytes: new Blob([deferredText]).size,
      measure: parsed.ok ? measureJson(parsed.value) : null,
    }
  }, [deferredText])
  const parsed = doc?.parsed ?? null
  const result = parsed?.ok ? resolvePath(parsed.value, path) : null

  /** Swaps in a new document and starts again from its root. */
  const loadDocument = (nextText: string, name: string | null) => {
    setText(nextText)
    setSource(name)
    setPath([])
    setDraft("")
  }

  const pick = (nextPath: JsonPath) => {
    setPath(nextPath)
    setDraft(formatPath(nextPath))
  }

  const handleFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds the 5 MB limit.")
      return
    }
    file.text().then(
      (contents) => loadDocument(contents, file.name),
      () => toast.error("Couldn't read that file.")
    )
  }

  const loadExample = async () => {
    try {
      const response = await fetch(assetUrl("data/example.json"))
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const example: unknown = await response.json()
      loadDocument(
        JSON.stringify(example, null, settings.indent),
        "example.json"
      )
    } catch (error) {
      toast.error(
        `Couldn't load the example: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    }
  }

  const chooseFile = () => fileInputRef.current?.click()

  const copyJson = () => {
    if (result?.found) {
      copyWithToast(
        JSON.stringify(result.value, null, settings.indent),
        "JSON copied"
      )
    }
  }

  const errorAt = parsed && !parsed.ok && parsed.line ? parsed : null

  return (
    // Breakpoints follow the page's own width, not the viewport's, so the rail
    // still fits beside the canvas when the site sidebar is open.
    <div className="@container/explorer flex flex-1 flex-col">
      <div className="flex flex-1 flex-col @3xl/explorer:h-[calc(100svh-3.5rem)] @3xl/explorer:flex-none">
        <div className="flex h-15 shrink-0 items-center gap-3 border-b px-4 @3xl/explorer:px-5">
          <button
            type="button"
            onClick={chooseFile}
            title="Open a JSON file"
            className="flex min-w-0 items-center gap-2 rounded-full bg-card py-1 pr-2.5 pl-2 text-caption text-muted-foreground ring-1 ring-tool-control-ring transition-colors duration-150 outline-none hover:bg-tool-raised-hover focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-card"
          >
            <FileJson className="size-3.5 shrink-0" />
            <span
              className={cn(
                "truncate font-mono text-xs",
                source ? "text-foreground" : "text-subtle"
              )}
            >
              {source ?? "Untitled"}
            </span>
            <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap tabular-nums @max-5xl/explorer:hidden">
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 rounded-full",
                  !parsed && "bg-subtle",
                  parsed?.ok && "bg-(--code-add-accent)",
                  parsed && !parsed.ok && "bg-destructive"
                )}
              />
              {!doc
                ? "Open, drop or paste JSON"
                : doc.parsed.ok
                  ? `Valid · ${plural(doc.lines, "line")} · ${formatBytes(doc.bytes)}`
                  : `Invalid JSON${errorAt ? ` · line ${errorAt.line}` : ""}`}
            </span>
          </button>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Button variant="outline" onClick={chooseFile}>
              <Upload />
              <span className="@max-2xl/explorer:sr-only">Open file</span>
            </Button>
            <Button variant="outline" onClick={loadExample}>
              <Braces />
              <span className="@max-2xl/explorer:sr-only">Example</span>
            </Button>
            <Button
              disabled={!result?.found}
              onClick={copyJson}
              className={cn(brandFillClass, "px-3 font-semibold")}
            >
              <Copy />
              <span className="@max-2xl/explorer:sr-only">Copy JSON</span>
            </Button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col @3xl/explorer:flex-row-reverse">
          <SettingsRail
            settings={settings}
            onChange={updateSettings}
            draft={draft}
            onDraftChange={setDraft}
            onQuery={() => pick(parsePath(draft))}
            queryError={
              result && !result.found
                ? `Nothing at "${formatPath(path)}".`
                : null
            }
            className="@max-3xl/explorer:order-last @max-3xl/explorer:border-t"
          />

          <DropZone
            onFiles={([file]) => file && handleFile(file)}
            icon={<FileUp />}
            message="Drop a JSON file to explore it"
            className="flex min-h-0 min-w-0 flex-1 flex-col"
          >
            <section
              ref={inputRef}
              aria-label="Input"
              className="relative flex shrink-0 flex-col border-b"
              style={
                {
                  "--input-height": `${settings.inputHeight}rem`,
                } as React.CSSProperties
              }
            >
              <div className="flex h-10 items-center justify-between gap-3 border-b border-foreground/6 pr-3 pl-5">
                <label
                  htmlFor="json-input"
                  className="font-mono text-eyebrow text-muted-foreground uppercase"
                >
                  Input
                </label>
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "font-mono text-2xs whitespace-nowrap tabular-nums",
                      errorAt ? "text-destructive" : "text-subtle"
                    )}
                  >
                    {errorAt
                      ? `Line ${errorAt.line}, column ${errorAt.column}`
                      : `${plural(doc?.lines ?? 0, "line")} · ${deferredText.length} chars`}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <IconButton
                      label="Format input"
                      disabled={!parsed?.ok}
                      onClick={() =>
                        parsed?.ok &&
                        setText(
                          JSON.stringify(parsed.value, null, settings.indent)
                        )
                      }
                    >
                      <WandSparkles />
                    </IconButton>
                    <IconButton
                      label="Clear input"
                      disabled={!text}
                      onClick={() => loadDocument("", null)}
                    >
                      <Eraser />
                    </IconButton>
                  </div>
                </div>
              </div>
              <Textarea
                id="json-input"
                value={text}
                onChange={(event) => {
                  setText(event.target.value)
                  if (!event.target.value) setSource(null)
                }}
                placeholder="Paste JSON here, or drop a .json file"
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                className="field-sizing-fixed h-(--input-height) resize-none rounded-none border-0 px-5 py-4 font-mono text-xs leading-relaxed focus-visible:ring-0 md:text-xs dark:bg-transparent"
              />
              <InputResizeHandle
                height={settings.inputHeight}
                onPreview={(height) =>
                  inputRef.current?.style.setProperty(
                    "--input-height",
                    `${height}rem`
                  )
                }
                onCommit={(height) => updateSettings({ inputHeight: height })}
              />
            </section>

            {/* The tree sits on the same dotted canvas as the other workspace
                tools. On a wide page it scrolls inside the canvas; on a
                narrow one the canvas grows with it. */}
            <section
              aria-label="Tree"
              className="relative flex min-h-[26rem] flex-1 flex-col bg-[color:oklch(0.97_0_0)] bg-[image:radial-gradient(oklch(0_0_0/7%)_1px,transparent_1px)] bg-size-[16px_16px] @3xl/explorer:min-h-0 dark:bg-tool-raised dark:bg-[image:radial-gradient(oklch(1_0_0/7%)_1px,transparent_1px)]"
            >
              <div
                ref={canvasRef}
                // On a wide page the scroll area stops above the hints at
                // the foot of the canvas, so a tall tree never runs under them.
                className="flex flex-1 flex-col items-center px-7 pt-7 pb-12 @3xl/explorer:absolute @3xl/explorer:top-0 @3xl/explorer:right-0 @3xl/explorer:bottom-8 @3xl/explorer:left-0 @3xl/explorer:overflow-auto @3xl/explorer:pb-7"
              >
                {!parsed ? (
                  <Empty className="m-auto max-w-sm flex-none">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Braces />
                      </EmptyMedia>
                      <EmptyTitle>Nothing to explore yet</EmptyTitle>
                      <EmptyDescription>
                        Paste JSON into the input, drop a .json file here, or
                        start from the example.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button variant="outline" onClick={loadExample}>
                        <Braces />
                        Load example
                      </Button>
                    </EmptyContent>
                  </Empty>
                ) : !parsed.ok ? (
                  <ParseErrorCard
                    text={deferredText}
                    message={parsed.message}
                    line={parsed.line}
                    column={parsed.column}
                  />
                ) : (
                  // `shrink-0`: a flex child with hidden overflow would otherwise
                  // shrink to the canvas instead of scrolling it.
                  <div className="w-full max-w-3xl shrink-0 overflow-hidden rounded-xl bg-card shadow-xl ring-1 shadow-black/15 ring-foreground/6 dark:bg-[color:oklch(0.17_0_0)] dark:shadow-black/50">
                    <div className="flex h-11 items-center gap-3 border-b border-foreground/6 pr-2 pl-2.5">
                      <Breadcrumb
                        aria-label="Query path"
                        className="min-w-0 flex-1 overflow-hidden"
                      >
                        <BreadcrumbList className="flex-nowrap gap-0.5 font-mono text-xs whitespace-nowrap">
                          {["$", ...path].map((label, index, crumbs) => (
                            <Fragment key={index}>
                              {index > 0 && (
                                <BreadcrumbSeparator className="text-subtle [&>svg]:size-3" />
                              )}
                              <BreadcrumbItem>
                                {index === crumbs.length - 1 ? (
                                  <BreadcrumbPage className="rounded-md bg-brand-soft px-1.5 py-0.5 font-medium text-brand">
                                    {label}
                                  </BreadcrumbPage>
                                ) : (
                                  <BreadcrumbLink asChild>
                                    <button
                                      type="button"
                                      onClick={() => pick(path.slice(0, index))}
                                      className="rounded-md px-1.5 py-0.5 outline-none hover:bg-tool-row-hover focus-visible:ring-3 focus-visible:ring-ring/50"
                                    >
                                      {label}
                                    </button>
                                  </BreadcrumbLink>
                                )}
                              </BreadcrumbItem>
                            </Fragment>
                          ))}
                        </BreadcrumbList>
                      </Breadcrumb>
                      <span className="shrink-0 text-xs whitespace-nowrap text-subtle tabular-nums @max-xl/explorer:hidden">
                        {result?.found ? describeValue(result.value) : ""}
                      </span>
                      <IconButton
                        label="Copy path"
                        onClick={() =>
                          copyWithToast(formatPath(path) || "$", "Path copied")
                        }
                      >
                        <Copy />
                      </IconButton>
                    </div>

                    {result?.found ? (
                      <div className="overflow-x-auto py-2.5">
                        <JsonTree
                          // Remount so a new depth or query applies to every node.
                          key={`${settings.expand}:${formatPath(path)}`}
                          value={result.value}
                          path={path}
                          onPick={pick}
                          collapsed={collapsedFor(settings.expand)}
                          stringLimit={stringLimitFor(settings.stringLimit)}
                          indentWidth={settings.indent}
                          {...settings.display}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 px-6 pt-10 pb-9 text-center">
                        <p className="text-sm font-semibold">
                          Nothing at <InlineCode>{formatPath(path)}</InlineCode>
                        </p>
                        <p className="max-w-[40ch] text-caption text-muted-foreground">
                          Check the spelling, or go back and click a key in the
                          tree.
                        </p>
                        <Button variant="outline" onClick={() => pick([])}>
                          <ArrowLeft />
                          Back to the root
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {result?.found && (
                <p className="pointer-events-none absolute bottom-3.5 left-4.5 flex items-center gap-2 font-mono text-2xs text-subtle @max-xl/explorer:hidden">
                  <MousePointerClick className="size-3.25" />
                  Click a key to query its path
                </p>
              )}
              <p className="pointer-events-none absolute right-4.5 bottom-3.5 font-mono text-2xs text-subtle tabular-nums">
                {doc?.measure
                  ? `${plural(doc.measure.values, "value")} · depth ${doc.measure.depth}`
                  : doc
                    ? "Not parsed"
                    : "No document"}
              </p>
            </section>
          </DropZone>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) handleFile(file)
            // Reset so choosing the same file again still fires a change.
            event.target.value = ""
          }}
        />
      </div>
    </div>
  )
}

/** Where the JSON stopped parsing, with the lines around it. */
function ParseErrorCard({
  text,
  message,
  line,
  column,
}: {
  text: string
  message: string
  line?: number
  column?: number
}) {
  const lines = text.split("\n")
  const excerpt = line
    ? lines
        .slice(Math.max(0, line - 3), Math.min(lines.length, line + 1))
        .map((content, index) => ({
          number: Math.max(1, line - 2) + index,
          content,
        }))
    : []

  return (
    <div
      role="alert"
      className="w-full max-w-2xl shrink-0 overflow-hidden rounded-xl bg-card shadow-xl ring-1 shadow-black/15 ring-foreground/6 dark:bg-[color:oklch(0.17_0_0)] dark:shadow-black/50"
    >
      <div className="flex items-center gap-2.5 border-b border-foreground/6 px-4 py-3">
        <CircleAlert className="size-4 shrink-0 text-destructive" />
        <span className="text-sm font-semibold">This JSON doesn't parse</span>
        {line && (
          <span className="ml-auto font-mono text-2xs whitespace-nowrap text-subtle">
            Line {line}, column {column}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-3 px-4 pt-3.5 pb-4">
        <p className="text-caption">{message}</p>
        {excerpt.length > 0 && (
          <div className="overflow-x-auto rounded-lg bg-muted py-2 font-mono text-xs leading-5">
            {excerpt.map(({ number, content }) => (
              <Fragment key={number}>
                <div
                  className={cn(
                    "flex min-w-max whitespace-pre",
                    number === line && "bg-destructive/10"
                  )}
                >
                  <span
                    className={cn(
                      "w-11 shrink-0 pr-3.5 text-right",
                      number === line ? "text-destructive" : "text-subtle"
                    )}
                  >
                    {number}
                  </span>
                  <span className="pr-4">{content || " "}</span>
                </div>
                {number === line && column && (
                  <div className="flex min-w-max whitespace-pre text-destructive">
                    <span className="w-11 shrink-0" />
                    <span className="pr-4">{" ".repeat(column - 1)}^ here</span>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        )}
        <p className="text-xs text-subtle">
          Fix it in the input. The tree comes back as soon as it parses.
        </p>
      </div>
    </div>
  )
}
