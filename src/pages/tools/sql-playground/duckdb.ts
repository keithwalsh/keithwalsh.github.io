import {
  AsyncDuckDB,
  DuckDBDataProtocol,
  VoidLogger,
  getPlatformFeatures,
} from "@duckdb/duckdb-wasm"
import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm"
// ponytail: only the exception-handling build ships, which halves dist/. It
// needs Chrome 95, Firefox 100 or Safari 15.2; add the mvp bundle and
// `selectBundle` if older browsers ever matter.
import ehWorker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url"
import ehWasm from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url"

import { assetUrl } from "@/lib/browser"
import {
  SAMPLE_FILES,
  SENSOR_READINGS_SQL,
} from "@/pages/tools/sql-playground/examples"

type Engine = { db: AsyncDuckDB; conn: AsyncDuckDBConnection }

export type QueryResult = {
  columns: { name: string; numeric: boolean }[]
  /** Cells are formatted for display; null is SQL NULL. */
  rows: (string | null)[][]
  ms: number
}

export type TableInfo = {
  name: string
  rowCount: string | null
  columns: { name: string; type: string }[]
}

let enginePromise: Promise<Engine> | undefined

/**
 * The one DuckDB instance for this tab, started on first use with the sample
 * tables loaded.
 */
export function getEngine() {
  // ponytail: never terminated, so tables survive leaving the page and
  // StrictMode's double effect can't start two. Costs the tab its wasm memory
  // until reload; terminate on unmount if that ever matters.
  enginePromise ??= startEngine().catch((cause: unknown) => {
    enginePromise = undefined
    throw cause
  })
  return enginePromise
}

async function startEngine(): Promise<Engine> {
  // Without this guard an unsupported browser never settles `instantiate`.
  const features = await getPlatformFeatures()
  if (!features.wasmExceptions) {
    throw new Error(
      "This browser can't run DuckDB. It needs Chrome 95, Firefox 100 or Safari 15.2 or later."
    )
  }

  const db = new AsyncDuckDB(new VoidLogger(), new Worker(ehWorker))
  await db.instantiate(ehWasm)
  // ponytail: DECIMAL and HUGEINT arrive as doubles, exact only to 2^53.
  await db.open({ query: { castDecimalToDouble: true } })
  const conn = await db.connect()

  // Tools make no network calls beyond public/. Left on, a query that touches
  // an unbundled extension (Parquet, JSON) fetches it from duckdb.org.
  await conn.query(
    "SET autoinstall_known_extensions = false; SET autoload_known_extensions = false"
  )

  for (const { table, file } of SAMPLE_FILES) {
    const response = await fetch(assetUrl(file))
    if (!response.ok) {
      throw new Error(`Couldn't load ${file} (HTTP ${response.status})`)
    }
    await db.registerFileText(`${table}.csv`, await response.text())
    await createTableFromCsv({ db, conn }, table)
  }
  await conn.query(SENSOR_READINGS_SQL)

  return { db, conn }
}

/** `name` must already be a safe identifier; its file is `<name>.csv`. */
async function createTableFromCsv({ db, conn }: Engine, name: string) {
  try {
    await conn.query(
      `CREATE OR REPLACE TABLE "${name}" AS SELECT * FROM read_csv('${name}.csv')`
    )
  } finally {
    await db.dropFile(`${name}.csv`)
  }
}

/**
 * A filename as a table name of `[a-z0-9_]` only. The name is interpolated
 * into SQL, so nothing else from the filename may survive.
 */
function tableNameFor(filename: string) {
  const name = filename
    .replace(/\.[^.]*$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
  return /^[a-z]/.test(name) ? name : `t_${name}`
}

if (import.meta.env.DEV) {
  console.assert(tableNameFor("Q3 Sales (final).csv") === "q3_sales_final")
  console.assert(tableNameFor("2024.csv") === "t_2024")
  console.assert(
    tableNameFor(`x"; DROP TABLE rain; --.csv`) === "x_drop_table_rain"
  )
}

/** Loads a CSV or TSV file as a table and returns the table's name. */
export async function loadFile(file: File) {
  const engine = await getEngine()
  const name = tableNameFor(file.name)
  await engine.db.registerFileHandle(
    `${name}.csv`,
    file,
    DuckDBDataProtocol.BROWSER_FILEREADER,
    true
  )
  await createTableFromCsv(engine, name)
  return name
}

/** Microseconds as `HH:MM:SS`, with a fraction only when there is one. */
function formatClock(micros: bigint) {
  const abs = micros < 0n ? -micros : micros
  const seconds = abs / 1_000_000n
  const clock = [seconds / 3600n, (seconds / 60n) % 60n, seconds % 60n]
    .map((part) => String(part).padStart(2, "0"))
    .join(":")
  const fraction = abs % 1_000_000n
  return `${micros < 0n ? "-" : ""}${clock}${
    fraction ? `.${String(fraction).padStart(6, "0")}` : ""
  }`
}

function formatCell(value: unknown, type: string): string | null {
  if (value === null || value === undefined) return null
  // Arrow hands DATE and TIMESTAMP back as epoch milliseconds.
  if (typeof value === "number" && /^(Date|Timestamp)/.test(type)) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return String(value)
    const iso = date.toISOString()
    return type.startsWith("Date")
      ? iso.slice(0, 10)
      : iso.slice(0, 19).replace("T", " ")
  }
  // TIME arrives as microseconds since midnight.
  if (typeof value === "bigint" && type.startsWith("Time")) {
    return formatClock(value)
  }
  // Nested values (LIST, STRUCT) print through Arrow's own toString.
  return String(value)
}

/**
 * Arrow JS 17 misreads DuckDB's INTERVAL (every `ts - ts` is one), so this
 * decodes the raw buffer: four int32s per value, being months, days, then
 * nanoseconds as a low and a high word. Printed the way DuckDB prints them.
 */
function formatIntervals(vector: {
  // Only what is read from an Arrow vector, whose buffer is typed `any`.
  data: readonly { values: unknown; offset: number; length: number }[]
  isValid(index: number): boolean
}) {
  const plural = (count: number, unit: string) =>
    `${count} ${unit}${Math.abs(count) === 1 ? "" : "s"}`

  const cells: (string | null)[] = []
  for (const { values: words, offset, length } of vector.data) {
    for (let index = 0; index < length; index++) {
      if (!(words instanceof Int32Array) || !vector.isValid(cells.length)) {
        cells.push(null)
        continue
      }
      const at = 4 * (offset + index)
      const months = words[at] ?? 0
      const days = words[at + 1] ?? 0
      const micros =
        ((BigInt(words[at + 3] ?? 0) << 32n) |
          BigInt((words[at + 2] ?? 0) >>> 0)) /
        1000n

      const parts = [
        Math.trunc(months / 12) && plural(Math.trunc(months / 12), "year"),
        months % 12 && plural(months % 12, "month"),
        days && plural(days, "day"),
      ].filter((part) => typeof part === "string")
      if (micros !== 0n || parts.length === 0) parts.push(formatClock(micros))
      cells.push(parts.join(" "))
    }
  }
  return cells
}

/**
 * Runs SQL and returns the first result set. Every statement runs, but
 * duckdb-wasm only hands back the first one that returns rows.
 */
export async function runQuery(sql: string): Promise<QueryResult> {
  const { conn } = await getEngine()
  const started = performance.now()
  const table = await conn.query(sql)
  const ms = performance.now() - started

  // Arrow names its types (`Int64`, `Date32<DAY>`), not DuckDB's.
  const types = table.schema.fields.map((field) => String(field.type))

  // ponytail: the whole result is formatted in memory. Fine to a few hundred
  // thousand rows; stream with `conn.send` if results get bigger.
  const cells = types.map((type, index) => {
    const vector = table.getChildAt(index)
    if (!vector) return []
    if (type.startsWith("Interval")) return formatIntervals(vector)
    return Array.from({ length: table.numRows }, (_, row) => {
      // Arrow types every cell as `any`.
      const value: unknown = vector.get(row)
      return formatCell(value, type)
    })
  })
  const rows = Array.from({ length: table.numRows }, (_, row) =>
    cells.map((column) => column[row] ?? null)
  )

  return {
    columns: table.schema.fields.map((field, index) => ({
      name: field.name,
      numeric: /^(Int|Uint|Float|Decimal)/.test(types[index] ?? ""),
    })),
    rows,
    ms,
  }
}

/** Every table and view in the database, with its columns in order. */
export async function listTables(): Promise<TableInfo[]> {
  const { rows } = await runQuery(`
    SELECT c.table_name, t.estimated_size, c.column_name, c.data_type
    FROM information_schema.columns AS c
    LEFT JOIN duckdb_tables() AS t USING (table_name)
    WHERE c.table_schema = 'main'
    ORDER BY c.table_name, c.ordinal_position`)

  const tables = new Map<string, TableInfo>()
  for (const [name, rowCount = null, column, type] of rows) {
    if (!name || !column || !type) continue
    const table = tables.get(name) ?? { name, rowCount, columns: [] }
    table.columns.push({ name: column, type })
    tables.set(name, table)
  }
  return [...tables.values()]
}
