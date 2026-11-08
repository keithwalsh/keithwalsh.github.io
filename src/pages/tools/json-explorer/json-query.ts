export type JsonPath = readonly string[]

export type ParseResult =
  | { ok: true; value: unknown }
  | { ok: false; message: string; line?: number; column?: number }

/**
 * Parses JSON and, when it fails, finds where. Browsers word the error
 * differently: Chrome says "(line 4 column 5)", Firefox "at line 4 column 5",
 * older engines only "at position 58".
 */
export function parseJson(text: string): ParseResult {
  try {
    return { ok: true, value: JSON.parse(text) }
  } catch (error) {
    const raw = error instanceof Error ? error.message : "Unknown error"
    const message = raw
      .replace(/^JSON\.parse:\s*/, "")
      .replace(/\s*(in JSON )?at position \d+.*$/, "")
      .replace(/\s*at line \d+ column \d+.*$/, "")
    const sentence = message.charAt(0).toUpperCase() + message.slice(1)

    const lineColumn = /line (\d+) column (\d+)/.exec(raw)
    if (lineColumn) {
      return {
        ok: false,
        message: sentence,
        line: Number(lineColumn[1]),
        column: Number(lineColumn[2]),
      }
    }
    const position = /position (\d+)/.exec(raw)
    if (position) {
      const before = text.slice(0, Number(position[1])).split("\n")
      return {
        ok: false,
        message: sentence,
        line: before.length,
        column: (before.at(-1)?.length ?? 0) + 1,
      }
    }
    return { ok: false, message: sentence }
  }
}

/** Reads `user.name`, `$.user.name` or `$` into path segments. */
export function parsePath(text: string): string[] {
  return text
    .trim()
    .replace(/^\$\.?/, "")
    .split(".")
    .filter(Boolean)
}

export function formatPath(path: JsonPath) {
  return path.join(".")
}

/** Follows a path such as `["items", "0", "id"]` into a parsed document. */
export function resolvePath(
  value: unknown,
  path: JsonPath
): { found: true; value: unknown } | { found: false } {
  let current = value
  for (const key of path) {
    if (
      typeof current !== "object" ||
      current === null ||
      !Object.hasOwn(current, key)
    ) {
      return { found: false }
    }
    current = (current as Record<string, unknown>)[key]
  }
  return { found: true, value: current }
}

export function isContainer(value: unknown): value is object {
  return typeof value === "object" && value !== null
}

/** "5 items" for an array, "1 key" for an object. */
export function countLabel(value: object) {
  const isArray = Array.isArray(value)
  const count = isArray ? value.length : Object.keys(value).length
  const noun = isArray ? "item" : "key"
  return `${count} ${noun}${count === 1 ? "" : "s"}`
}

/** A one-line summary of a value, e.g. "object · 8 keys". */
export function describeValue(value: unknown) {
  if (value === null) return "null"
  if (Array.isArray(value)) return `array · ${countLabel(value)}`
  if (typeof value === "object") return `object · ${countLabel(value)}`
  if (typeof value === "string") {
    return `string · ${value.length} ${value.length === 1 ? "char" : "chars"}`
  }
  return typeof value
}

/** How many values a document holds, counting containers, and how deep it goes. */
export function measureJson(value: unknown, depth = 0) {
  let values = 1
  let maxDepth = depth
  if (isContainer(value)) {
    // `Object.values(object)` types its values as `any`.
    const children: unknown[] = Object.values(value)
    for (const child of children) {
      const inner = measureJson(child, depth + 1)
      values += inner.values
      maxDepth = Math.max(maxDepth, inner.depth)
    }
  }
  return { values, depth: maxDepth }
}
