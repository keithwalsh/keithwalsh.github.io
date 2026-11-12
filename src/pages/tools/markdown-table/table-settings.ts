export const OUTPUT_OPTIONS = [
  { key: "isCompact", id: "table-compact", label: "Minimise whitespace" },
  { key: "hasTabs", id: "table-tabs", label: "Tabs instead of spaces" },
  {
    key: "convertLineBreaks",
    id: "table-line-breaks",
    label: "Line breaks as <br>",
  },
  { key: "hasPadding", id: "table-padding", label: "Pad cell content" },
] as const

export type OutputOptions = Record<
  (typeof OUTPUT_OPTIONS)[number]["key"],
  boolean
>

export type TableSettings = {
  options: OutputOptions
  /** Height of the output panel, in rem, see `lib/input-height.ts`. */
  outputHeight: number
}

export const DEFAULT_SETTINGS: TableSettings = {
  options: {
    isCompact: false,
    hasTabs: false,
    convertLineBreaks: false,
    hasPadding: true,
  },
  outputHeight: 14,
}

export const KEYS = [
  {
    keys: "Enter",
    effect: "Moves down a row. On the last row it adds a new one.",
  },
  { keys: "Shift+Enter", effect: "Starts a new line inside the cell." },
  { keys: "Tab", effect: "Moves to the next cell." },
]

/** What the row under the header looks like for each column alignment. */
export const DELIMITERS = [
  { syntax: ":--", alignment: "Left" },
  { syntax: ":-:", alignment: "Centre" },
  { syntax: "--:", alignment: "Right" },
  { syntax: "---", alignment: "No alignment" },
]
