import { useMemo, useState } from "react"
import { Copy, Download, Settings2 } from "lucide-react"
import { generateMarkdownTable, MarkdownTable } from "react-markdown-table-ts"

import { IconButton } from "@/components/icon-button"
import { Page, PageHeader } from "@/components/page"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { copyWithToast, downloadTextFile } from "@/lib/browser"
import { MarkdownPreview } from "@/pages/tools/markdown-table/markdown-preview"
import { TableEditor } from "@/pages/tools/markdown-table/table-editor"
import { useTableEditor } from "@/pages/tools/markdown-table/use-table-editor"

const OUTPUT_OPTIONS = [
  { key: "isCompact", label: "Minimise whitespace between cells" },
  { key: "hasTabs", label: "Use tabs instead of spaces" },
  { key: "convertLineBreaks", label: "Convert line breaks to <br>" },
  { key: "hasPadding", label: "Add padding around content" },
] as const

type OutputOptions = Record<(typeof OUTPUT_OPTIONS)[number]["key"], boolean>

export default function MarkdownTablePage() {
  const { table, canUndo, canRedo, dispatch } = useTableEditor()
  const [options, setOptions] = useState<OutputOptions>({
    isCompact: false,
    hasTabs: false,
    convertLineBreaks: false,
    hasPadding: true,
  })

  const markdown = useMemo(
    () =>
      generateMarkdownTable(table.cells, {
        columnAlignments: table.alignments,
        ...options,
      }),
    [table, options]
  )

  return (
    <Page>
      <PageHeader description="Build a table and copy it as GitHub Flavored Markdown." />

      <Card>
        <CardContent>
          <TableEditor
            table={table}
            canUndo={canUndo}
            canRedo={canRedo}
            dispatch={dispatch}
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="markdown">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton label="Output options">
                  <Settings2 />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Output options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {OUTPUT_OPTIONS.map(({ key, label }) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={options[key]}
                    onSelect={(event) => event.preventDefault()}
                    onCheckedChange={(checked) =>
                      setOptions((previous) => ({
                        ...previous,
                        [key]: checked,
                      }))
                    }
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <IconButton
              label="Copy Markdown"
              onClick={() => copyWithToast(markdown, "Markdown copied")}
            >
              <Copy />
            </IconButton>
            <IconButton
              label="Download Markdown"
              onClick={() => downloadTextFile(markdown, "markdown-table.md")}
            >
              <Download />
            </IconButton>
          </div>
        </div>
        <TabsContent value="markdown">
          <div className="overflow-hidden rounded-lg border bg-muted/40 pt-3 text-xs [--rmt-background:transparent] [--rmt-border-radius:0] [--rmt-color:var(--foreground)] [--rmt-font-family:var(--font-mono)] [--rmt-line-number-color:var(--muted-foreground)] [--rmt-selection-background:Highlight] [--rmt-text-shadow:none] [&_.rmt-line-numbers]:border-border!">
            <MarkdownTable
              inputData={table.cells}
              columnAlignments={table.alignments}
              {...options}
              topPadding={0}
              role="region"
              aria-label="Generated Markdown"
            />
          </div>
        </TabsContent>
        <TabsContent value="preview">
          <MarkdownPreview markdown={markdown} />
        </TabsContent>
      </Tabs>
    </Page>
  )
}
