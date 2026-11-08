import { useState } from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  countLabel,
  isContainer,
  type JsonPath,
} from "@/pages/tools/json-explorer/json-query"

type JsonTreeOptions = {
  /** `true` collapses everything; a number collapses nodes at that depth or deeper. */
  collapsed: boolean | number
  /** Truncate strings longer than this; click a truncated string to expand it. */
  stringLimit: number | false
  /** Indent per level, in characters. */
  indentWidth: number
  showArrayIndices: boolean
  showDataTypes: boolean
  showItemCounts: boolean
  /** Called with a key's full path when the key is clicked. */
  onPick: (path: JsonPath) => void
}

type NodeProps = {
  name?: string
  value: unknown
  path: JsonPath
  depth: number
  inArray: boolean
  options: JsonTreeOptions
}

function typeLabel(value: unknown) {
  if (value === null) return "null"
  if (typeof value === "number")
    return Number.isInteger(value) ? "int" : "float"
  if (typeof value === "boolean") return "bool"
  return typeof value
}

/** Renders `value`, whose own path is `path`, as a collapsible tree. */
export function JsonTree({
  value,
  path,
  ...options
}: JsonTreeOptions & { value: unknown; path: JsonPath }) {
  return (
    <div className="px-3 pl-7 font-mono text-xs leading-5">
      <JsonNode
        value={value}
        path={path}
        depth={0}
        inArray={false}
        options={options}
      />
    </div>
  )
}

function JsonNode({ name, value, path, depth, inArray, options }: NodeProps) {
  const showKey = name !== undefined && (!inArray || options.showArrayIndices)
  const key = showKey && (
    <>
      <button
        type="button"
        title={`Query ${path.join(".")}`}
        onClick={() => options.onPick(path)}
        className={cn(
          "rounded-xs underline-offset-3 transition-colors duration-150 hover:text-brand hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
          inArray ? "text-muted-foreground" : "text-foreground/85"
        )}
      >
        {inArray ? name : `"${name}"`}
      </button>
      <span className="text-muted-foreground">: </span>
    </>
  )

  if (!isContainer(value)) {
    // Long values wrap, so a tall tree never hides a sideways scrollbar at
    // its foot.
    return (
      <div className="rounded-sm wrap-anywhere hover:bg-tool-row-hover">
        {key}
        <JsonValue value={value} options={options} />
      </div>
    )
  }

  return (
    <JsonContainer {...{ name, keyLabel: key, value, path, depth, options }} />
  )
}

function JsonContainer({
  name,
  keyLabel,
  value,
  path,
  depth,
  options,
}: {
  name?: string
  keyLabel: React.ReactNode
  value: object
  path: JsonPath
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
  const label = `${open ? "Collapse" : "Expand"} ${name ?? path.at(-1) ?? "root"}`

  if (entries.length === 0) {
    return (
      <div className="rounded-sm whitespace-nowrap hover:bg-tool-row-hover">
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
      <div className="relative rounded-sm whitespace-nowrap hover:bg-tool-row-hover">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={label}
          className="absolute top-0.5 -left-4 flex size-4 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <ChevronRight
            className={cn(
              "size-3 transition-transform duration-150",
              open && "rotate-90"
            )}
          />
        </button>
        {keyLabel}
        <span className="text-muted-foreground">
          {openBracket}
          {!open && (
            <>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={label}
                className="mx-0.5 rounded-xs bg-tool-symbol px-1 text-2xs leading-4 hover:text-foreground"
              >
                …
              </button>
              {closeBracket}
            </>
          )}
        </span>
        {options.showItemCounts && (
          <span className="ml-2.5 font-sans text-2xs text-subtle italic">
            {countLabel(value)}
          </span>
        )}
      </div>
      {open && (
        <>
          {/* The guide line runs under this node's chevron. */}
          <div
            className="-ml-2 border-l border-foreground/12"
            style={{ paddingLeft: `calc(${options.indentWidth}ch + 1rem)` }}
          >
            {entries.map(([entryKey, entryValue]) => (
              <JsonNode
                key={entryKey}
                name={entryKey}
                value={entryValue}
                path={[...path, entryKey]}
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
  const limit = options.stringLimit
  const dataType = options.showDataTypes && (
    <span className="mr-1.5 text-2xs text-subtle">{typeLabel(value)}</span>
  )

  if (typeof value === "string") {
    if (limit === false || value.length <= limit) {
      return (
        <>
          {dataType}
          <span className="text-code-string">"{value}"</span>
        </>
      )
    }
    return (
      <>
        {dataType}
        <button
          type="button"
          title={expanded ? "Shorten" : `Show all ${value.length} characters`}
          onClick={() => setExpanded(!expanded)}
          className="rounded-xs text-left text-code-string focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          "{expanded ? value : `${value.slice(0, limit)}…`}"
        </button>
      </>
    )
  }

  return (
    <>
      {dataType}
      <span
        className={cn(
          typeof value === "number" && "text-code-number",
          typeof value === "boolean" && "text-code-function",
          value === null && "text-code-keyword"
        )}
      >
        {String(value)}
      </span>
    </>
  )
}
