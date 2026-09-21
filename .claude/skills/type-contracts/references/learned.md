# Learned

### 2026-09-21 — a second library returns `any`: Apache Arrow, via DuckDB-WASM
`conn.query()` in `src/pages/tools/sql-playground/duckdb.ts` returns
`Table<any>`. Reading cells as `const value: unknown = vector.get(row)` passed
both gates with no cast. Passing the vector itself to a helper did not: a
parameter typed from Arrow (`NonNullable<ReturnType<Table["getChildAt"]>>`)
resolved to `Vector<DataType>`, and the call raised `no-unsafe-argument`
("Unsafe argument of type `Vector<any>`").
Evidence: `npm run lint` failed at `duckdb.ts:223:61`, then passed once the
parameter became a structural type of only the members read
(`{ data: readonly { values: unknown; offset: number; length: number }[];
isValid(index: number): boolean }`).
Proposed: Boundaries should list Arrow next to Recharts, with the recipe "type
a helper's parameter as the few members it reads, with `unknown` for the
`any` ones, rather than naming the library's generic".

### 2026-09-21 — both gates passed and the output was still wrong
DuckDB `INTERVAL` and `TIME` columns typechecked and linted clean but rendered
as `0,0` and `45296000000`: Arrow JS 17 misreads the month-day-nano interval
layout and returns TIME as raw microseconds.
Evidence: running `SELECT INTERVAL 90 MINUTE, TIME '12:34:56'` in the preview
showed the wrong cells; after `formatIntervals` and `formatClock` the same
query shows `01:30:00` and `12:34:56`.
Proposed: Verify should say that for a library value formatted with
`String(value)`, run one row of every type the source can produce and read the
rendered cells.
