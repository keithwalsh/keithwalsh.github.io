import type { ReactNode } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/** Table view of a chart: first column is the label, the rest are numbers. */
export function DataTable({
  columns,
  rows,
}: {
  columns: string[]
  rows: { key: string | number; cells: ReactNode[] }[]
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                key={column}
                className={index > 0 ? "text-right" : undefined}
              >
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.key}>
              {row.cells.map((cell, index) => (
                <TableCell
                  key={index}
                  className={
                    index > 0 ? "text-right tabular-nums" : "font-medium"
                  }
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
