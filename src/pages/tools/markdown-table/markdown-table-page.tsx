import { useEffect, useRef, useState } from "react"
import {
  ArrowLeftRight,
  ClipboardPaste,
  Copy,
  Download,
  Eraser,
  Table2,
} from "lucide-react"
import { MarkdownTable, useMarkdownTable } from "react-markdown-table-ts"

import { brandFillClass } from "@/components/editorial"
import { IconButton } from "@/components/icon-button"
import { InputResizeHandle } from "@/components/input-resize-handle"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  copyWithToast,
  downloadTextFile,
  readStoredObject,
} from "@/lib/browser"
import { readInputHeight } from "@/lib/input-height"
import { cn } from "@/lib/utils"
import { MarkdownPreview } from "@/pages/tools/markdown-table/markdown-preview"
import { SettingsRail } from "@/pages/tools/markdown-table/settings-rail"
import { TableEditor } from "@/pages/tools/markdown-table/table-editor"
import {
  DEFAULT_SETTINGS,
  OUTPUT_OPTIONS,
  type OutputOptions,
  type TableSettings,
} from "@/pages/tools/markdown-table/table-settings"
import { useTableEditor } from "@/pages/tools/markdown-table/use-table-editor"

const STORAGE_KEY = "markdown-table-settings"

// Settings (not the table) persist between visits. Anything unrecognised in
// storage falls back to its default.
function loadSettings(): TableSettings {
  const saved = readStoredObject(STORAGE_KEY)
  if (!saved) return DEFAULT_SETTINGS
  const options: Record<string, unknown> =
    saved.options && typeof saved.options === "object"
      ? { ...saved.options }
      : {}
  return {
    options: Object.fromEntries(
      OUTPUT_OPTIONS.map(({ key }) => {
        const value = options[key]
        return [
          key,
          typeof value === "boolean" ? value : DEFAULT_SETTINGS.options[key],
        ]
      })
    ) as OutputOptions,
    outputHeight: readInputHeight(
      saved.outputHeight,
      DEFAULT_SETTINGS.outputHeight
    ),
  }
}

const plural = (count: number, noun: string) =>
  `${count} ${noun}${count === 1 ? "" : "s"}`

// The output tabs read as the panel's eyebrow label, with the active one
// underlined in the brand colour on the label row's own border.
const outputTabClass =
  "h-full flex-none rounded-sm border-0 px-0 py-0 font-mono text-eyebrow font-normal text-muted-foreground uppercase after:bg-brand group-data-horizontal/tabs:after:bottom-0"

export default function MarkdownTablePage() {
  const { table, canUndo, canRedo, dispatch } = useTableEditor()
  const [settings, setSettings] = useState(loadSettings)
  // The output panel reads its height from this variable. A drag writes it
  // here directly and only commits to settings once the pointer lifts.
  const outputRef = useRef<HTMLElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // Storage can be unavailable (private mode, blocked site data).
    }
  }, [settings])

  const updateSettings = (patch: Partial<TableSettings>) =>
    setSettings((current) => ({ ...current, ...patch }))

  const { markdown } = useMarkdownTable(table.cells, {
    columnAlignments: table.alignments,
    ...settings.options,
  })

  const rowCount = table.cells.length
  const columnCount = table.alignments.length
  const isEmpty = table.cells.every((row) =>
    row.every((value) => !value.trim())
  )
  const stats = `${plural(markdown.trimEnd().split("\n").length, "line")} · ${markdown.length} chars`

  const copyMarkdown = () => copyWithToast(markdown, "Markdown copied")

  return (
    // Breakpoints follow the page's own width, not the viewport's, so the rail
    // still fits beside the canvas when the site sidebar is open.
    <div className="@container/table flex flex-1 flex-col">
      <div className="flex flex-1 flex-col @3xl/table:h-[calc(100svh-3.5rem)] @3xl/table:flex-none">
        <div className="flex h-15 shrink-0 items-center gap-3 border-b px-4 @3xl/table:px-5">
          <div className="flex min-w-0 items-center gap-2 rounded-full bg-card py-1 pr-2.5 pl-2 text-caption text-muted-foreground ring-1 ring-tool-control-ring dark:bg-card">
            <Table2 className="size-3.5 shrink-0" />
            <span className="font-mono text-xs whitespace-nowrap text-foreground tabular-nums">
              {rowCount} × {columnCount}
            </span>
            <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap tabular-nums @max-5xl/table:hidden">
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 rounded-full",
                  isEmpty ? "bg-subtle" : "bg-(--code-add-accent)"
                )}
              />
              {isEmpty ? "Type or paste cells" : `GFM · ${stats}`}
            </span>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              title="Swap rows and columns"
              onClick={() => dispatch({ type: "transpose" })}
            >
              <ArrowLeftRight />
              <span className="@max-2xl/table:sr-only">Transpose</span>
            </Button>
            <Button
              variant="outline"
              title="Clear all cells"
              disabled={isEmpty}
              onClick={() => dispatch({ type: "clear" })}
            >
              <Eraser />
              <span className="@max-2xl/table:sr-only">Clear</span>
            </Button>
            <Button
              onClick={copyMarkdown}
              className={cn(brandFillClass, "px-3 font-semibold")}
            >
              <Copy />
              <span className="@max-2xl/table:sr-only">Copy Markdown</span>
            </Button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col @3xl/table:flex-row-reverse">
          <SettingsRail
            options={settings.options}
            onChange={(options) => updateSettings({ options })}
            className="@max-3xl/table:order-last @max-3xl/table:border-t"
          />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            {/* The grid sits on the same dotted canvas as the other workspace
                tools. On a wide page it scrolls inside the canvas; on a
                narrow one the canvas grows with it. */}
            <section
              aria-label="Table"
              className="relative flex min-h-[22rem] flex-1 flex-col bg-[color:oklch(0.97_0_0)] bg-[image:radial-gradient(oklch(0_0_0/7%)_1px,transparent_1px)] bg-size-[16px_16px] @3xl/table:min-h-0 dark:bg-tool-raised dark:bg-[image:radial-gradient(oklch(1_0_0/7%)_1px,transparent_1px)]"
            >
              <div
                // On a wide page the scroll area stops above the hints at
                // the foot of the canvas, so a tall table never runs under them.
                className="flex flex-1 flex-col items-center px-7 pt-7 pb-12 @3xl/table:absolute @3xl/table:top-0 @3xl/table:right-0 @3xl/table:bottom-8 @3xl/table:left-0 @3xl/table:overflow-auto @3xl/table:pb-7"
              >
                <TableEditor
                  table={table}
                  canUndo={canUndo}
                  canRedo={canRedo}
                  dispatch={dispatch}
                />
              </div>

              <p className="pointer-events-none absolute bottom-3.5 left-4.5 flex items-center gap-2 font-mono text-2xs text-subtle @max-xl/table:hidden">
                <ClipboardPaste className="size-3.25" />
                Row 1 is the header. Paste cells from a spreadsheet to fill the
                table
              </p>
              <p className="pointer-events-none absolute right-4.5 bottom-3.5 font-mono text-2xs text-subtle tabular-nums">
                {rowCount} × {columnCount} ·{" "}
                {plural(rowCount * columnCount, "cell")}
              </p>
            </section>

            <section
              ref={outputRef}
              aria-label="Output"
              className="relative flex shrink-0 flex-col border-t"
              style={
                {
                  "--output-height": `${settings.outputHeight}rem`,
                } as React.CSSProperties
              }
            >
              <InputResizeHandle
                edge="top"
                label="Resize output"
                height={settings.outputHeight}
                onPreview={(height) =>
                  outputRef.current?.style.setProperty(
                    "--output-height",
                    `${height}rem`
                  )
                }
                onCommit={(height) => updateSettings({ outputHeight: height })}
              />
              <Tabs defaultValue="markdown" className="gap-0">
                <div className="flex h-10 items-center justify-between gap-3 border-b border-foreground/6 pr-3 pl-5">
                  <TabsList
                    variant="line"
                    className="gap-4.5 p-0 group-data-horizontal/tabs:h-full"
                  >
                    <TabsTrigger value="markdown" className={outputTabClass}>
                      Markdown
                    </TabsTrigger>
                    <TabsTrigger value="preview" className={outputTabClass}>
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-2xs whitespace-nowrap text-subtle tabular-nums @max-md/table:hidden">
                      {stats}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <IconButton label="Copy Markdown" onClick={copyMarkdown}>
                        <Copy />
                      </IconButton>
                      <IconButton
                        label="Download Markdown"
                        onClick={() =>
                          downloadTextFile(markdown, "markdown-table.md")
                        }
                      >
                        <Download />
                      </IconButton>
                    </div>
                  </div>
                </div>
                <TabsContent
                  value="markdown"
                  className="h-(--output-height) flex-none overflow-auto"
                >
                  <MarkdownTable
                    markdown={markdown}
                    theme="inherit"
                    role="region"
                    aria-label="Generated Markdown"
                    className="[--rmt-border-radius:0] [--rmt-font-family:var(--font-mono)] [--rmt-font-size:var(--text-xs)] [--rmt-line-number-border:1px_solid_var(--border)] [--rmt-line-number-color:var(--subtle)] [--rmt-padding:1rem_1.25rem] [--rmt-width:100%]"
                  />
                </TabsContent>
                <TabsContent
                  value="preview"
                  className="h-(--output-height) flex-none overflow-auto p-5"
                >
                  <div className="w-fit max-w-full">
                    <MarkdownPreview markdown={markdown} />
                  </div>
                </TabsContent>
              </Tabs>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
