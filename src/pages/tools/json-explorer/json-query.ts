export type JsonResult =
  { ok: true; value: unknown } | { ok: false; error: string }

export function parseJson(text: string): JsonResult {
  try {
    return { ok: true, value: JSON.parse(text) }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return { ok: false, error: `JSON parsing error: ${message}` }
  }
}

/** Resolves a dot-notation path such as `user.name` or `items.0.id`. */
export function queryJson(value: unknown, path: string): JsonResult {
  const trimmed = path.trim()
  if (!trimmed) {
    return { ok: true, value }
  }

  let current = value
  for (const key of trimmed.split(".")) {
    if (typeof current !== "object" || current === null || !(key in current)) {
      return { ok: false, error: `Nothing found at "${trimmed}"` }
    }
    current = (current as Record<string, unknown>)[key]
  }

  return { ok: true, value: current }
}
