type TextFormat = {
  bold: boolean
  italic: boolean
  code: boolean
}

const WRAPPERS = [
  ["bold", "**"],
  ["italic", "_"],
  ["code", "`"],
] as const

/** Peels Markdown emphasis wrappers off a cell value, in any nesting order. */
export function parseCellFormat(value: string) {
  const format: TextFormat = { bold: false, italic: false, code: false }
  let text = value
  let changed = true

  while (changed) {
    changed = false
    for (const [key, marker] of WRAPPERS) {
      if (
        !format[key] &&
        text.length > marker.length * 2 &&
        text.startsWith(marker) &&
        text.endsWith(marker)
      ) {
        format[key] = true
        text = text.slice(marker.length, -marker.length)
        changed = true
      }
    }
  }

  return { text, format }
}

/** Wraps text in a canonical order: code innermost, italic outermost. */
export function formatCellValue(text: string, format: TextFormat) {
  let value = text
  if (format.code) value = `\`${value}\``
  if (format.bold) value = `**${value}**`
  if (format.italic) value = `_${value}_`
  return value
}
