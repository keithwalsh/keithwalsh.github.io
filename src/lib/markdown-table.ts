export type Alignment = "left" | "center" | "right" | "none"

export type MarkdownTableOptions = {
  columnAlignments?: readonly Alignment[]
  /** Treat the first row as the header; otherwise columns are named A, B, C... */
  hasHeader?: boolean
  /** Skip padding columns to a shared width. */
  isCompact?: boolean
  /** Separate cell content from pipes with a tab. */
  hasTabs?: boolean
  /** Separate cell content from pipes with a space. */
  hasPadding?: boolean
  /** Replace line breaks inside cells with `<br>`. */
  convertLineBreaks?: boolean
}

export function columnName(index: number) {
  let name = ""
  for (let i = index; i >= 0; i = Math.floor(i / 26) - 1) {
    name = String.fromCharCode((i % 26) + 65) + name
  }
  return name
}

export function generateMarkdownTable(
  data: readonly (readonly string[])[],
  {
    columnAlignments = [],
    hasHeader = true,
    isCompact = false,
    hasTabs = false,
    hasPadding = true,
    convertLineBreaks = false,
  }: MarkdownTableOptions = {}
): string {
  const columnCount = Math.max(0, ...data.map((row) => row.length))
  if (columnCount === 0) {
    return ""
  }

  // Pipes would end the cell early and raw newlines would end the row.
  const formatText = (text: string) =>
    text
      .replace(/\|/g, "\\|")
      .replace(/\r?\n/g, convertLineBreaks ? "<br>" : " ")

  const header = hasHeader
    ? data[0]
    : Array.from({ length: columnCount }, (_, index) => columnName(index))
  const rows = [header, ...(hasHeader ? data.slice(1) : data)].map((row) =>
    Array.from({ length: columnCount }, (_, column) =>
      formatText(row[column] ?? "")
    )
  )

  const alignments = Array.from(
    { length: columnCount },
    (_, column) => columnAlignments[column] ?? "none"
  )
  const widths = isCompact
    ? null
    : alignments.map((_, column) =>
        Math.max(3, ...rows.map((row) => row[column].length))
      )
  const pad = hasTabs ? "\t" : hasPadding ? " " : ""

  const formatCell = (text: string, column: number) => {
    const width = widths?.[column] ?? text.length
    switch (alignments[column]) {
      case "right":
        return pad + text.padStart(width) + pad
      case "center": {
        const space = width - text.length
        const left = Math.floor(space / 2)
        return pad + " ".repeat(left) + text + " ".repeat(space - left) + pad
      }
      default:
        return pad + text.padEnd(width) + pad
    }
  }

  const formatDivider = (alignment: Alignment, column: number) => {
    const width = widths?.[column] ?? 3
    switch (alignment) {
      case "left":
        return pad + ":" + "-".repeat(width - 1) + pad
      case "right":
        return pad + "-".repeat(width - 1) + ":" + pad
      case "center":
        return pad + ":" + "-".repeat(width - 2) + ":" + pad
      default:
        return pad + "-".repeat(width) + pad
    }
  }

  const toRow = (cells: string[]) => `|${cells.join("|")}|`
  const [headerRow, ...bodyRows] = rows

  return [
    toRow(headerRow.map(formatCell)),
    toRow(alignments.map(formatDivider)),
    ...bodyRows.map((row) => toRow(row.map(formatCell))),
  ].join("\n")
}
