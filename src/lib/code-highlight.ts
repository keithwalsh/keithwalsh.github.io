import Prism from "prismjs"
import "prismjs/components/prism-markup-templating"
import "prismjs/components/prism-php"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-json"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-python"
import "prismjs/components/prism-java"
import "prismjs/components/prism-c"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-ruby"
import "prismjs/components/prism-csharp"
import "prismjs/components/prism-go"
import "prismjs/components/prism-rust"
import "prismjs/components/prism-yaml"

export type LineKind = "add" | "remove"

export type HighlightedLine = {
  html: string
  kind?: LineKind
  highlighted: boolean
}

type WordMark = "add" | "delete"

const COMMENT = String.raw`(?:\/\/|#|--|<!--|\/\*)`

/** Matches a line holding nothing but the given magic comment. */
function commentLine(marker: string) {
  return new RegExp(String.raw`^\s*${COMMENT}\s*${marker}\s*(?:-->|\*\/)?\s*$`)
}

const LINE_MARKER = commentLine("(Remove|Add)")
const HIGHLIGHT_NEXT = commentLine("highlight-next-line")
const HIGHLIGHT_START = commentLine("highlight-start")
const HIGHLIGHT_END = commentLine("highlight-end")

// Private-use characters survive Prism tokenization, so word marks are added
// before highlighting and turned into spans afterwards.
const SENTINELS: Record<string, { mark: WordMark; open: boolean }> = {
  "": { mark: "add", open: true },
  "": { mark: "add", open: false },
  "": { mark: "delete", open: true },
  "": { mark: "delete", open: false },
}

const SENTINEL_PATTERN = new RegExp(`[${Object.keys(SENTINELS).join("")}]`, "g")

const MARK_CLASS: Record<WordMark, string> = {
  add: "word-add",
  delete: "word-delete",
}

const DIFF_PREFIX: Record<LineKind, string> = {
  add: "+",
  remove: "-",
}

type ParsedLine = Omit<HighlightedLine, "html"> & { text: string }

/**
 * Strips magic comments and records what they apply to:
 * `// Remove` and `// Add` mark the next line, `highlight-next-line` and
 * `highlight-start`/`highlight-end` highlight lines, and `[-word-]` or
 * `[+word+]` mark words within a line.
 */
function parseMagicComments(code: string): ParsedLine[] {
  const parsed: ParsedLine[] = []
  let pendingKind: LineKind | undefined
  let highlightNext = false
  let inHighlightBlock = false

  for (const line of code.split("\n")) {
    const marker = line.match(LINE_MARKER)
    if (marker) {
      pendingKind = marker[1] === "Add" ? "add" : "remove"
      continue
    }
    if (HIGHLIGHT_NEXT.test(line)) {
      highlightNext = true
      continue
    }
    if (HIGHLIGHT_START.test(line)) {
      inHighlightBlock = true
      continue
    }
    if (HIGHLIGHT_END.test(line)) {
      inHighlightBlock = false
      continue
    }

    parsed.push({
      text: line
        .replace(/\[-(.+?)-\]/g, "$1")
        .replace(/\[\+(.+?)\+\]/g, "$1"),
      kind: pendingKind,
      highlighted: highlightNext || inHighlightBlock,
    })
    pendingKind = undefined
    highlightNext = false
  }

  return parsed
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

const MARK_SPAN = /<span class="(word-(?:add|delete))">([^<]*)<\/span>/g
const TAGS_ONLY = /^(?:<[^>]+>)*$/

/**
 * A word mark covering several tokens is split into one span per token. Adds
 * `word-start` and `word-end` to the outer spans of each run, so the run is
 * padded and rounded at its ends instead of around every token.
 */
function markRunEdges(line: string) {
  const spans = Array.from(line.matchAll(MARK_SPAN))
  // Spans belong to one run when they share a mark and only tags sit between.
  const joined = (left?: RegExpExecArray, right?: RegExpExecArray) =>
    !!left &&
    !!right &&
    left[1] === right[1] &&
    TAGS_ONLY.test(line.slice(left.index + left[0].length, right.index))

  let result = ""
  let lastIndex = 0
  spans.forEach((span, index) => {
    const classes = [span[1]]
    if (!joined(spans[index - 1], span)) classes.push("word-start")
    if (!joined(span, spans[index + 1])) classes.push("word-end")
    result += line.slice(lastIndex, span.index)
    result += `<span class="${classes.join(" ")}">${span[2]}</span>`
    lastIndex = span.index + span[0].length
  })

  return result + line.slice(lastIndex)
}

/**
 * Splits highlighted HTML into one balanced fragment per line. Token spans that
 * cross a newline are closed at the line end and reopened on the next line,
 * and word-mark spans are closed and reopened around every token tag.
 */
function splitIntoLines(html: string): string[] {
  const lines: string[] = []
  const openTags: string[] = []
  let mark: WordMark | null = null
  let current = ""

  const openMark = () => (mark ? `<span class="${MARK_CLASS[mark]}">` : "")
  const closeMark = () => (mark ? "</span>" : "")

  let lastIndex = 0
  for (const match of html.matchAll(/<span[^>]*>|<\/span>|\n|[-]/g)) {
    current += html.slice(lastIndex, match.index)
    lastIndex = match.index + match[0].length
    const token = match[0]

    if (token === "\n") {
      lines.push(current + closeMark() + "</span>".repeat(openTags.length))
      current = openTags.join("") + openMark()
    } else if (token in SENTINELS) {
      const sentinel = SENTINELS[token]
      current += closeMark()
      mark = sentinel.open ? sentinel.mark : null
      current += openMark()
    } else if (token === "</span>") {
      current += closeMark() + token
      openTags.pop()
      current += openMark()
    } else {
      current += closeMark() + token
      openTags.push(token)
      current += openMark()
    }
  }

  lines.push(
    current +
      html.slice(lastIndex) +
      closeMark() +
      "</span>".repeat(openTags.length)
  )

  return lines.map((line) =>
    markRunEdges(
      line.replace(/<span class="word-(?:add|delete)"><\/span>/g, "")
    )
  )
}

export function highlightCode(
  code: string,
  language: string,
  { annotations = true }: { annotations?: boolean } = {}
): HighlightedLine[] {
  const parsed = annotations
    ? parseMagicComments(code)
    : code.split("\n").map((text): ParsedLine => ({ text, highlighted: false }))
  const source = parsed.map((line) => line.text).join("\n")
  const grammar = Prism.languages[language]
  const html = grammar
    ? Prism.highlight(source, grammar, language)
    : escapeHtml(source)
  const htmlLines = splitIntoLines(html)

  return parsed.map(({ kind, highlighted }, index) => ({
    html: htmlLines[index] ?? "",
    kind,
    highlighted,
  }))
}

/**
 * Converts annotated code to a fenced Markdown code block. Code with added or
 * removed lines becomes a `diff` block; word marks and highlights have no
 * Markdown equivalent, so they are dropped.
 */
export function toMarkdownCodeBlock(code: string, language: string) {
  const lines = parseMagicComments(code)
  const isDiff = lines.some((line) => line.kind)
  const body = lines
    .map(({ text, kind }) => {
      const plain = text.replace(SENTINEL_PATTERN, "")
      if (!isDiff) return plain
      return `${kind ? DIFF_PREFIX[kind] : " "}${plain}`
    })
    .join("\n")

  // The fence must be longer than any backtick run in the code, or that run
  // would close the block early.
  const longestRun = Math.max(
    2,
    ...Array.from(body.matchAll(/`+/g), (match) => match[0].length)
  )
  const fence = "`".repeat(longestRun + 1)

  return `${fence}${isDiff ? "diff" : language}\n${body}\n${fence}`
}
