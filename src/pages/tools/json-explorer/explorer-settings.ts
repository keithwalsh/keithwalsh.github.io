export const EXPAND_OPTIONS = [
  { value: "all", label: "All" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "none", label: "None" },
] as const

export const STRING_LIMIT_OPTIONS = [
  { value: "off", label: "Off" },
  { value: "20", label: "20" },
  { value: "40", label: "40" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
] as const

export type ExpandDepth = (typeof EXPAND_OPTIONS)[number]["value"]
export type StringLimit = (typeof STRING_LIMIT_OPTIONS)[number]["value"]

/** Spaces per level, for the tree and for copied or formatted JSON. */
export const INDENT = { min: 1, max: 10, step: 1 }

export const DISPLAY_OPTIONS = [
  { key: "showArrayIndices", id: "json-array-indices", label: "Array indices" },
  { key: "showDataTypes", id: "json-data-types", label: "Data types" },
  { key: "showItemCounts", id: "json-item-counts", label: "Item counts" },
] as const

export type DisplayOptions = Record<
  (typeof DISPLAY_OPTIONS)[number]["key"],
  boolean
>

export type ExplorerSettings = {
  expand: ExpandDepth
  stringLimit: StringLimit
  indent: number
  display: DisplayOptions
  /** Height of the input panel, in rem, see `lib/input-height.ts`. */
  inputHeight: number
}

export const DEFAULT_SETTINGS: ExplorerSettings = {
  expand: "all",
  stringLimit: "off",
  indent: 4,
  display: {
    showArrayIndices: true,
    showDataTypes: false,
    showItemCounts: true,
  },
  // The old fixed `h-56`.
  inputHeight: 14,
}

export const PATH_SYNTAX = [
  {
    example: "object.first-child",
    effect: "A key inside an object, joined with dots",
  },
  { example: "array.0", effect: "An array item, by its index" },
  {
    example: "$",
    effect: "The whole document. Click any crumb above the tree to go back up",
  },
]

/** The tree's `collapsed` option for an expand depth. */
export function collapsedFor(expand: ExpandDepth): boolean | number {
  if (expand === "all") return false
  if (expand === "none") return true
  return Number(expand)
}

/** The tree's `stringLimit` option for a string limit. */
export function stringLimitFor(limit: StringLimit): number | false {
  return limit === "off" ? false : Number(limit)
}
