import { useReducer } from "react"

import type { Alignment } from "@/lib/markdown-table"

export type TableData = {
  cells: string[][]
  alignments: Alignment[]
}

type TableEdit =
  | {
      type: "setCell"
      row: number
      column: number
      value: string
      /** Merge with the previous edit to the same cell into one undo step. */
      coalesce?: boolean
    }
  | { type: "paste"; row: number; column: number; values: string[][] }
  | { type: "setAlignment"; column: number; alignment: Alignment }
  | { type: "insertRow"; index: number }
  | { type: "removeRow"; index: number }
  | { type: "insertColumn"; index: number }
  | { type: "removeColumn"; index: number }
  | { type: "transpose" }
  | { type: "clear" }

export type TableAction = TableEdit | { type: "undo" } | { type: "redo" }

type History = {
  past: TableData[]
  present: TableData
  future: TableData[]
  lastEditKey: string | null
}

const HISTORY_LIMIT = 100
const DEFAULT_ALIGNMENT: Alignment = "left"

const emptyRow = (columns: number) => Array.from({ length: columns }, () => "")

function createTable(rows: number, columns: number): TableData {
  return {
    cells: Array.from({ length: rows }, () => emptyRow(columns)),
    alignments: Array.from({ length: columns }, () => DEFAULT_ALIGNMENT),
  }
}

function applyEdit(table: TableData, edit: TableEdit): TableData {
  const { cells, alignments } = table
  const columnCount = alignments.length

  switch (edit.type) {
    case "setCell":
      return {
        alignments,
        cells: cells.map((row, r) =>
          r === edit.row
            ? row.map((value, c) => (c === edit.column ? edit.value : value))
            : row
        ),
      }
    case "paste": {
      const rowCount = Math.max(cells.length, edit.row + edit.values.length)
      const pastedWidth = Math.max(...edit.values.map((row) => row.length))
      const nextColumnCount = Math.max(columnCount, edit.column + pastedWidth)
      return {
        cells: Array.from({ length: rowCount }, (_, r) =>
          Array.from(
            { length: nextColumnCount },
            (_, c) =>
              edit.values[r - edit.row]?.[c - edit.column] ??
              cells[r]?.[c] ??
              ""
          )
        ),
        alignments: Array.from(
          { length: nextColumnCount },
          (_, c) => alignments[c] ?? DEFAULT_ALIGNMENT
        ),
      }
    }
    case "setAlignment":
      return {
        cells,
        alignments: alignments.map((alignment, c) =>
          c === edit.column ? edit.alignment : alignment
        ),
      }
    case "insertRow":
      return {
        alignments,
        cells: cells.toSpliced(edit.index, 0, emptyRow(columnCount)),
      }
    case "removeRow":
      return cells.length <= 1
        ? table
        : { alignments, cells: cells.toSpliced(edit.index, 1) }
    case "insertColumn":
      return {
        cells: cells.map((row) => row.toSpliced(edit.index, 0, "")),
        alignments: alignments.toSpliced(edit.index, 0, DEFAULT_ALIGNMENT),
      }
    case "removeColumn":
      return columnCount <= 1
        ? table
        : {
            cells: cells.map((row) => row.toSpliced(edit.index, 1)),
            alignments: alignments.toSpliced(edit.index, 1),
          }
    case "transpose":
      return {
        cells: alignments.map((_, c) => cells.map((row) => row[c])),
        alignments: cells.map(() => DEFAULT_ALIGNMENT),
      }
    case "clear":
      return { alignments, cells: cells.map((row) => row.map(() => "")) }
  }
}

function historyReducer(history: History, action: TableAction): History {
  switch (action.type) {
    case "undo": {
      const previous = history.past.at(-1)
      if (!previous) return history
      return {
        past: history.past.slice(0, -1),
        present: previous,
        future: [history.present, ...history.future],
        lastEditKey: null,
      }
    }
    case "redo": {
      const [next, ...future] = history.future
      if (!next) return history
      return {
        past: [...history.past, history.present],
        present: next,
        future,
        lastEditKey: null,
      }
    }
    default: {
      const present = applyEdit(history.present, action)
      if (present === history.present) return history

      const editKey =
        action.type === "setCell" && action.coalesce
          ? `${action.row}:${action.column}`
          : null
      if (editKey && editKey === history.lastEditKey) {
        return { ...history, present, future: [] }
      }

      return {
        past: [...history.past, history.present].slice(-HISTORY_LIMIT),
        present,
        future: [],
        lastEditKey: editKey,
      }
    }
  }
}

/** Table cells and column alignments with undo/redo history. */
export function useTableEditor(rows = 4, columns = 4) {
  const [history, dispatch] = useReducer(historyReducer, null, (): History => ({
    past: [],
    present: createTable(rows, columns),
    future: [],
    lastEditKey: null,
  }))

  return {
    table: history.present,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    dispatch,
  }
}
