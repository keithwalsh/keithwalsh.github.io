import { useState } from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

type JsonTreeOptions = {
  /** `true` collapses everything; a number collapses nodes at that depth or deeper. */
  collapsed: boolean | number
  /** Truncate strings longer than this; click a truncated string to expand it. */
  collapseStringsAfterLength: number | false
  displayDataTypes: boolean
  displayObjectSize: boolean
  displayArrayKey: boolean
  indentWidth: number
}

type NodeProps = {
  name?: string
  value: unknown
  depth: number
  inArray: boolean
  options: JsonTreeOptions
}

function isContainer(value: unknown): value is object {
  return typeof value === "object" && value !== null
}

function typeLabel(value: unknown) {
  if (value === null) return "null"
  if (typeof value === "number")
    return Number.isInteger(value) ? "int" : "float"
  if (typeof value === "boolean") return "bool"
  return typeof value
}

export function JsonTree({
  value,
  ...options
}: JsonTreeOptions & { value: unknown }) {
  return (
    <div className="pl-4 font-mono text-xs leading-relaxed">
      <JsonNode value={value} depth={0} inArray={false} options={options} />
    </div>
  )
}

function JsonNode({ name, value, depth, inArray, options }: NodeProps) {
  const showKey = name !== undefined && (!inArray || options.displayArrayKey)
  const key = showKey && (
    <>
      <span className="text-code-number">{inArray ? name : `"${name}"`}</span>
      <span className="text-muted-foreground">: </span>
    </>
  )

  if (!isContainer(value)) {
    return (
      <div className="break-all">
        {key}
        <JsonValue value={value} options={options} />
      </div>
    )
  }

  return <JsonContainer {...{ keyLabel: key, value, depth, options }} />
}

function JsonContainer({
  keyLabel,
  value,
  depth,
  options,
}: {
  keyLabel: React.ReactNode
  value: object
  depth: number
  options: JsonTreeOptions
}) {
  const { collapsed } = options
  const [open, setOpen] = useState(
    collapsed === false || (typeof collapsed === "number" && depth < collapsed)
  )
  const isArray = Array.isArray(value)
  // `Object.entries(object)` types its values as `any`.
  const entries: [string, unknown][] = Object.entries(value)
  const [openBracket, closeBracket] = isArray ? ["[", "]"] : ["{", "}"]

  if (entries.length === 0) {
    return (
      <div>
        {keyLabel}
        <span className="text-muted-foreground">
          {openBracket}
          {closeBracket}
        </span>
      </div>
    )
  }

  return (
    <div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Collapse" : "Expand"}
          className="absolute top-0.5 -left-4 flex size-4 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <ChevronRight
            className={cn("size-3 transition-transform", open && "rotate-90")}
          />
        </button>
        {keyLabel}
        <span className="text-muted-foreground">
          {openBracket}
          {!open && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="px-0.5 hover:text-foreground"
            >
              …
            </button>
          )}
          {!open && closeBracket}
        </span>
        {options.displayObjectSize && (
          <span className="ml-2 text-2xs text-muted-foreground italic">
            {entries.length} {entries.length === 1 ? "item" : "items"}
          </span>
        )}
      </div>
      {open && (
        <>
          <div
            className="border-l border-border"
            style={{
              marginLeft: "0.3ch",
              paddingLeft: `${options.indentWidth}ch`,
            }}
          >
            {entries.map(([entryKey, entryValue]) => (
              <JsonNode
                key={entryKey}
                name={entryKey}
                value={entryValue}
                depth={depth + 1}
                inArray={isArray}
                options={options}
              />
            ))}
          </div>
          <span className="text-muted-foreground">{closeBracket}</span>
        </>
      )}
    </div>
  )
}

function JsonValue({
  value,
  options,
}: {
  value: unknown
  options: JsonTreeOptions
}) {
  const [expanded, setExpanded] = useState(false)
  const limit = options.collapseStringsAfterLength
  const dataType = options.displayDataTypes && (
    <span className="mr-1 text-2xs text-muted-foreground">
      {typeLabel(value)}
    </span>
  )

  if (typeof value === "string") {
    const isTruncated = limit !== false && !expanded && value.length > limit
    return (
      <>
        {dataType}
        <span
          className={cn(
            "text-code-string",
            limit !== false && value.length > limit && "cursor-pointer"
          )}
          onClick={() => setExpanded(!expanded)}
        >
          "{isTruncated ? `${value.slice(0, limit)}…` : value}"
        </span>
      </>
    )
  }

  return (
    <>
      {dataType}
      <span
        className={cn(
          (typeof value === "number" || typeof value === "boolean") &&
            "text-code-number",
          value === null && "text-code-keyword"
        )}
      >
        {String(value)}
      </span>
    </>
  )
}
