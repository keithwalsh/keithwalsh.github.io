import { useRef, useState } from "react"
import { getColumnName, type Alignment } from "react-markdown-table-ts"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Italic,
  Minus,
  Plus,
  Redo2,
  Undo2,
} from "lucide-react"

import { IconButton } from "@/components/icon-button"
import { ButtonGroup } from "@/components/ui/button-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import {
  formatCellValue,
  parseCellFormat,
} from "@/pages/tools/markdown-table/cell-format"
import type {
  TableAction,
  TableData,
} from "@/pages/tools/markdown-table/use-table-editor"

const ALIGN_CLASS: Record<Alignment, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  none: "text-left",
}

/**
 * The grid, as a card on the workspace canvas. Its header bar acts on the
 * active cell, which stays marked after focus moves to a button.
 */
export function TableEditor({
  table,
  canUndo,
  canRedo,
  dispatch,
}: {
  table: TableData
  canUndo: boolean
  canRedo: boolean
  dispatch: React.Dispatch<TableAction>
}) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState({ row: 0, column: 0 })

  const rowCount = table.cells.length
  const columnCount = table.alignments.length
  const row = Math.min(active.row, rowCount - 1)
  const column = Math.min(active.column, columnCount - 1)
  const alignment = table.alignments[column] ?? "none"
  const { text, format } = parseCellFormat(table.cells[row]?.[column] ?? "")
  const activeFormats = (["bold", "italic", "code"] as const).filter(
    (key) => format[key]
  )

  const focusCell = (targetRow: number, targetColumn: number) => {
    requestAnimationFrame(() => {
      gridRef.current
        ?.querySelector<HTMLTextAreaElement>(
          `[data-cell="${targetRow}-${targetColumn}"]`
        )
        ?.focus()
    })
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    r: number,
    c: number
  ) => {
    // Enter moves down like a spreadsheet; Shift+Enter keeps a line break.
    if (event.key !== "Enter" || event.shiftKey) return
    event.preventDefault()
    if (r === rowCount - 1) {
      dispatch({ type: "insertRow", index: rowCount })
    }
    focusCell(r + 1, c)
  }

  const handlePaste = (
    event: React.ClipboardEvent<HTMLTextAreaElement>,
    r: number,
    c: number
  ) => {
    const pasted = event.clipboardData.getData("text/plain")
    // Tab- or newline-separated text (e.g. copied from a spreadsheet) fills
    // neighbouring cells, growing the table as needed.
    if (!/[\t\n]/.test(pasted.replace(/\r?\n$/, ""))) return
    event.preventDefault()
    const values = pasted
      .replace(/\r\n?/g, "\n")
      .replace(/\n$/, "")
      .split("\n")
      .map((line) => line.split("\t"))
    dispatch({ type: "paste", row: r, column: c, values })
  }

  return (
    // `shrink-0`: a flex child with hidden overflow would otherwise shrink to
    // the canvas instead of scrolling it.
    <div className="w-full max-w-4xl shrink-0 overflow-hidden rounded-xl bg-card shadow-xl ring-1 shadow-black/15 ring-foreground/6 dark:bg-[color:oklch(0.17_0_0)] dark:shadow-black/50">
      <div
        role="toolbar"
        aria-label="Table editing"
        className="flex min-h-11 flex-wrap items-center gap-2 border-b border-foreground/6 px-2.5 py-2"
      >
        <span className="min-w-7 rounded-md bg-brand-soft px-1.5 py-0.5 text-center font-mono text-xs font-medium text-brand tabular-nums">
          <span className="sr-only">Active cell </span>
          {getColumnName(column)}
          {row + 1}
        </span>

        <ButtonGroup>
          <IconButton
            variant="outline"
            label="Undo"
            disabled={!canUndo}
            onClick={() => dispatch({ type: "undo" })}
          >
            <Undo2 />
          </IconButton>
          <IconButton
            variant="outline"
            label="Redo"
            disabled={!canRedo}
            onClick={() => dispatch({ type: "redo" })}
          >
            <Redo2 />
          </IconButton>
        </ButtonGroup>

        <ToggleGroup
          type="multiple"
          variant="outline"
          size="sm"
          spacing={0}
          aria-label="Cell formatting"
          disabled={!text}
          value={[...activeFormats]}
          onValueChange={(values) =>
            dispatch({
              type: "setCell",
              row,
              column,
              value: formatCellValue(text, {
                bold: values.includes("bold"),
                italic: values.includes("italic"),
                code: values.includes("code"),
              }),
            })
          }
        >
          <ToggleGroupItem value="bold" aria-label="Bold">
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <Italic />
          </ToggleGroupItem>
          <ToggleGroupItem value="code" aria-label="Inline code">
            <Code />
          </ToggleGroupItem>
        </ToggleGroup>

        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          spacing={0}
          aria-label="Column alignment"
          value={alignment === "none" ? "" : alignment}
          onValueChange={(value) =>
            dispatch({
              type: "setAlignment",
              column,
              alignment: (value || "none") as Alignment,
            })
          }
        >
          <ToggleGroupItem value="left" aria-label="Align column left">
            <AlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Centre column">
            <AlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align column right">
            <AlignRight />
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="ml-auto flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Row</span>
            <ButtonGroup>
              <IconButton
                variant="outline"
                label="Insert row below"
                onClick={() => dispatch({ type: "insertRow", index: row + 1 })}
              >
                <Plus />
              </IconButton>
              <IconButton
                variant="outline"
                label="Remove row"
                disabled={rowCount <= 1}
                onClick={() => dispatch({ type: "removeRow", index: row })}
              >
                <Minus />
              </IconButton>
            </ButtonGroup>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Column</span>
            <ButtonGroup>
              <IconButton
                variant="outline"
                label="Insert column right"
                onClick={() =>
                  dispatch({ type: "insertColumn", index: column + 1 })
                }
              >
                <Plus />
              </IconButton>
              <IconButton
                variant="outline"
                label="Remove column"
                disabled={columnCount <= 1}
                onClick={() =>
                  dispatch({ type: "removeColumn", index: column })
                }
              >
                <Minus />
              </IconButton>
            </ButtonGroup>
          </div>
        </div>
      </div>

      <div ref={gridRef} className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="w-10 border-b" aria-hidden="true" />
              {table.alignments.map((_, c) => (
                <th
                  key={c}
                  scope="col"
                  className={cn(
                    "h-8 border-b border-l px-2 text-xs font-medium text-muted-foreground",
                    c === column && "bg-brand-soft text-brand"
                  )}
                >
                  {getColumnName(c)}
                </th>
              ))}
            </tr>
          </thead>
          {/* The card's own edge closes the last row. */}
          <tbody className="[&>tr:last-child>*]:border-b-0">
            {table.cells.map((cells, r) => (
              <tr key={r}>
                <th
                  scope="row"
                  className={cn(
                    "w-10 border-b bg-muted/50 px-2 text-xs font-medium text-muted-foreground",
                    r === row && "bg-brand-soft text-brand"
                  )}
                >
                  {r + 1}
                </th>
                {cells.map((value, c) => (
                  <td
                    key={c}
                    className={cn(
                      "border-b border-l p-0",
                      r === row &&
                        c === column &&
                        "bg-brand-soft/50 inset-ring-[1.5px] inset-ring-brand"
                    )}
                  >
                    <textarea
                      rows={1}
                      value={value}
                      data-cell={`${r}-${c}`}
                      aria-label={`Cell ${getColumnName(c)}${r + 1}`}
                      placeholder={r === 0 ? "Header" : undefined}
                      spellCheck={false}
                      onFocus={() => setActive({ row: r, column: c })}
                      onChange={(event) =>
                        dispatch({
                          type: "setCell",
                          row: r,
                          column: c,
                          value: event.target.value,
                          coalesce: true,
                        })
                      }
                      onKeyDown={(event) => handleKeyDown(event, r, c)}
                      onPaste={(event) => handlePaste(event, r, c)}
                      className={cn(
                        // The active cell's ring on the `td` is the focus
                        // indicator, so the textarea draws none of its own.
                        "block field-sizing-content min-h-9 w-full min-w-32 resize-none bg-transparent px-2.5 py-2 outline-none placeholder:text-muted-foreground/60",
                        r === 0 && "font-medium",
                        ALIGN_CLASS[table.alignments[c] ?? "none"]
                      )}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
