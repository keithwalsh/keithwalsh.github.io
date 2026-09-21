import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react"
import {
  BookOpen,
  CircleAlert,
  Copy,
  Download,
  Eraser,
  FileUp,
  Play,
  Table2,
} from "lucide-react"
import Papa from "papaparse"
import { toast } from "sonner"

import { DropZone } from "@/components/drop-zone"
import { brandFillClass } from "@/components/editorial"
import { IconButton } from "@/components/icon-button"
import { InlineCode } from "@/components/inline-code"
import { InstructionsCard } from "@/components/instructions-card"
import { Page, PageHeader } from "@/components/page"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import { Field, FieldTitle } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { copyWithToast, downloadBlob, readStoredObject } from "@/lib/browser"
import { cn } from "@/lib/utils"
import {
  getEngine,
  listTables,
  loadFile,
  runQuery,
  type QueryResult,
  type TableInfo,
} from "@/pages/tools/sql-playground/duckdb"
import { DEFAULT_SQL, EXAMPLES } from "@/pages/tools/sql-playground/examples"
import { SqlEditor } from "@/pages/tools/sql-playground/sql-editor"

const STORAGE_KEY = "sql-playground"
const FILE_TYPES = /\.(csv|tsv|txt)$/i
// ponytail: the grid renders the first rows only; copy and download carry
// them all. Virtualise the body if people need to scroll further.
const MAX_ROWS = 1000

function loadSql() {
  const saved = readStoredObject(STORAGE_KEY)
  return typeof saved?.sql === "string" ? saved.sql : DEFAULT_SQL
}

const errorMessage = (cause: unknown) =>
  cause instanceof Error ? cause.message : String(cause)

const toCsv = ({ columns, rows }: QueryResult) =>
  Papa.unparse({ fields: columns.map((column) => column.name), data: rows })

export default function SqlPlaygroundPage() {
  const [sql, setSql] = useState(loadSql)
  // null until the engine is up.
  const [tables, setTables] = useState<TableInfo[] | null>(null)
  const [engineError, setEngineError] = useState<string | null>(null)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [queryError, setQueryError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const run = async (text: string) => {
    if (!text.trim() || !tables) return
    setIsRunning(true)
    try {
      setResult(await runQuery(text))
      setQueryError(null)
      // The query may have created or dropped a table.
      setTables(await listTables())
    } catch (cause) {
      setResult(null)
      setQueryError(errorMessage(cause))
    } finally {
      setIsRunning(false)
    }
  }

  const runWith = (text: string) => {
    setSql(text)
    return run(text)
  }

  // Only the untouched default runs by itself: a saved query may name a
  // dropped file's table, which didn't survive the reload.
  const showDefault = useEffectEvent(async () => {
    if (sql !== DEFAULT_SQL) return
    try {
      setResult(await runQuery(DEFAULT_SQL))
    } catch (cause) {
      setQueryError(errorMessage(cause))
    }
  })

  useEffect(() => {
    let cancelled = false
    getEngine()
      .then(listTables)
      .then((loaded) => {
        if (cancelled) return
        setTables(loaded)
        return showDefault()
      })
      .catch((cause: unknown) => {
        if (!cancelled) setEngineError(errorMessage(cause))
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ sql }))
    } catch {
      // Storage can be unavailable (private mode, blocked site data).
    }
  }, [sql])

  const addFiles = async (files: File[]) => {
    for (const file of files) {
      if (!FILE_TYPES.test(file.name)) {
        toast.error(`${file.name} isn't a CSV or TSV file.`)
        continue
      }
      try {
        const name = await loadFile(file)
        setTables(await listTables())
        toast.success(`Loaded ${file.name} as ${name}`)
      } catch (cause) {
        toast.error(`Couldn't load ${file.name}: ${errorMessage(cause)}`)
      }
    }
  }

  const schema = useMemo(
    () =>
      Object.fromEntries(
        (tables ?? []).map((table) => [
          table.name,
          table.columns.map((column) => column.name),
        ])
      ),
    [tables]
  )

  return (
    <DropZone
      onFiles={addFiles}
      icon={<FileUp />}
      message="Drop a CSV to load it as a table"
      className="flex flex-1 flex-col"
    >
      <Page>
        <PageHeader description="Query CSV files with SQL. DuckDB runs in this tab as WebAssembly, so your data never leaves your machine." />

        {engineError && (
          <Alert variant="destructive">
            <CircleAlert />
            <AlertTitle>{engineError}</AlertTitle>
          </Alert>
        )}

        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <FieldTitle>Tables</FieldTitle>
              <Button
                variant="outline"
                size="sm"
                disabled={!tables}
                onClick={() => inputRef.current?.click()}
              >
                <FileUp />
                Add CSV
              </Button>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.tsv,.txt,text/csv"
                multiple
                tabIndex={-1}
                aria-hidden="true"
                className="sr-only"
                onChange={(event) => {
                  void addFiles([...(event.target.files ?? [])])
                  // Reset so choosing the same file again still fires a change.
                  event.target.value = ""
                }}
              />
            </div>

            {tables ? (
              <ul className="flex flex-col gap-2">
                {tables.map((table) => (
                  <li
                    key={table.name}
                    className="flex flex-col gap-x-3 gap-y-0.5 sm:flex-row sm:items-baseline"
                  >
                    <button
                      type="button"
                      title={`Preview ${table.name}`}
                      onClick={() =>
                        runWith(
                          `SELECT *\nFROM "${table.name.replaceAll('"', '""')}"\nLIMIT 100`
                        )
                      }
                      className="shrink-0 text-left font-mono text-sm font-medium underline-offset-4 hover:underline"
                    >
                      {table.name}
                      {table.rowCount && (
                        <span className="ml-2 font-normal text-muted-foreground">
                          {Number(table.rowCount).toLocaleString()} rows
                        </span>
                      )}
                    </button>
                    <span className="font-mono text-xs leading-relaxed text-muted-foreground">
                      {table.columns
                        .map((column) => `${column.name} ${column.type}`)
                        .join(", ")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              !engineError && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Spinner />
                  Loading DuckDB (about 8 MB, cached afterwards)
                </p>
              )
            )}
          </CardContent>
        </Card>

        <Field>
          <div className="flex items-center justify-between gap-2">
            <FieldTitle>Query</FieldTitle>
            <div className="-my-1 flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton label="Example queries">
                    <BookOpen />
                  </IconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Example queries</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {EXAMPLES.map((example) => (
                    <DropdownMenuItem
                      key={example.title}
                      onSelect={() => runWith(example.sql)}
                      className="justify-between gap-3"
                    >
                      {example.title}
                      <span className="text-xs text-muted-foreground">
                        {example.technique}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <IconButton
                label="Clear query"
                disabled={!sql}
                onClick={() => setSql("")}
              >
                <Eraser />
              </IconButton>
              <Button
                size="sm"
                disabled={!tables || !sql.trim() || isRunning}
                onClick={() => run(sql)}
                className={cn(brandFillClass, "ml-1 font-semibold")}
              >
                {isRunning ? <Spinner /> : <Play />}
                Run
              </Button>
            </div>
          </div>
          <SqlEditor
            value={sql}
            onChange={setSql}
            onRun={() => run(sql)}
            schema={schema}
            className="min-h-64"
          />
        </Field>

        <Field>
          <div className="flex items-center justify-between gap-2">
            <FieldTitle>
              Results
              {result && (
                <span className="ml-2 font-normal text-muted-foreground">
                  {result.rows.length.toLocaleString()}{" "}
                  {result.rows.length === 1 ? "row" : "rows"} in{" "}
                  {Math.round(result.ms).toLocaleString()} ms
                </span>
              )}
            </FieldTitle>
            <div className="-my-1 flex items-center gap-1">
              <IconButton
                label="Copy as CSV"
                disabled={!result?.rows.length}
                onClick={() =>
                  result && copyWithToast(toCsv(result), "Results copied")
                }
              >
                <Copy />
              </IconButton>
              <IconButton
                label="Download CSV"
                disabled={!result?.rows.length}
                onClick={() =>
                  result &&
                  downloadBlob(
                    new Blob([toCsv(result)], {
                      type: "text/csv;charset=utf-8",
                    }),
                    "query-result.csv"
                  )
                }
              >
                <Download />
              </IconButton>
            </div>
          </div>

          {queryError ? (
            <Alert variant="destructive">
              <CircleAlert />
              <AlertDescription>
                <pre className="font-mono text-xs whitespace-pre-wrap">
                  {queryError}
                </pre>
              </AlertDescription>
            </Alert>
          ) : result?.rows.length ? (
            <>
              <div className="max-h-[32rem] overflow-auto rounded-lg border [&_[data-slot=table-container]]:overflow-visible">
                <Table>
                  <TableHeader className="sticky top-0 bg-muted">
                    <TableRow>
                      {/* SQL allows duplicate column names, so key by position. */}
                      {result.columns.map((column, index) => (
                        <TableHead
                          key={index}
                          className={cn(
                            "font-mono text-xs",
                            column.numeric && "text-right"
                          )}
                        >
                          {column.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.rows.slice(0, MAX_ROWS).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, index) => (
                          <TableCell
                            key={index}
                            className={cn(
                              "font-mono text-xs",
                              result.columns[index]?.numeric &&
                                "text-right tabular-nums"
                            )}
                          >
                            {cell ?? (
                              <span className="text-muted-foreground italic">
                                NULL
                              </span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {result.rows.length > MAX_ROWS && (
                <p className="text-sm text-muted-foreground">
                  Showing the first {MAX_ROWS.toLocaleString()} rows. Copy or
                  download to get all {result.rows.length.toLocaleString()}.
                </p>
              )}
            </>
          ) : (
            <Empty className="rounded-lg border border-solid bg-muted/40">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Table2 />
                </EmptyMedia>
                <EmptyDescription>
                  {result
                    ? "Statement ran. No rows returned."
                    : "Run a query to see its results."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </Field>

        <InstructionsCard
          title="How to use"
          steps={[
            "Pick an example query, or write your own against the sample tables",
            <>
              Press <InlineCode>Ctrl+Enter</InlineCode> (
              <InlineCode>Cmd+Enter</InlineCode> on a Mac) or Run
            </>,
            "Drop a CSV or TSV file anywhere on the page to load it as a table, named after the file",
            "Click a table name to preview its first 100 rows",
            <>
              Tables last until you reload:{" "}
              <InlineCode>CREATE TABLE</InlineCode>,{" "}
              <InlineCode>CREATE VIEW</InlineCode> and{" "}
              <InlineCode>DROP</InlineCode> all work. When you run several
              statements, the first one that returns rows is shown
            </>,
          ]}
        />
      </Page>
    </DropZone>
  )
}
