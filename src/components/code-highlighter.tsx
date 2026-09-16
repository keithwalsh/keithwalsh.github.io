import { useMemo, type Ref } from "react"

import "@/components/code-highlighter.css"
import { highlightCode, type HighlightedLine } from "@/lib/code-highlight"
import { cn } from "@/lib/utils"

export type CodeHighlighterProps = {
  code: string
  language: string
  showLineNumbers?: boolean
  /** Apply magic comments such as `// Add` and `[+word+]`. */
  annotations?: boolean
  /** Wrap long lines instead of scrolling horizontally. */
  wrap?: boolean
  /** Strike through removed words so they don't rely on red and green alone. */
  strikethrough?: boolean
  title?: string
  className?: string
  ref?: Ref<HTMLDivElement>
}

/**
 * Numbers lines the way a unified diff does: removed lines only exist in the
 * code before the change, and added lines only in the code after it.
 */
function numberLines(lines: HighlightedLine[]) {
  let before = 0
  let after = 0
  return lines.map(({ kind }) => ({
    before: kind === "add" ? undefined : ++before,
    after: kind === "remove" ? undefined : ++after,
  }))
}

export function CodeHighlighter({
  code,
  language,
  showLineNumbers = false,
  annotations = true,
  wrap = true,
  strikethrough = false,
  title,
  className,
  ref,
}: CodeHighlighterProps) {
  const lines = useMemo(
    () => highlightCode(code, language, { annotations }),
    [code, language, annotations]
  )
  const lineNumbers = useMemo(() => numberLines(lines), [lines])
  // A diff gets a second gutter so both versions keep their own line numbers.
  const isDiff = lines.some((line) => line.kind)

  return (
    <div
      ref={ref}
      data-wrap={wrap}
      data-strikethrough={strikethrough}
      className={cn(
        "code-block overflow-hidden rounded-lg border bg-muted/40",
        className
      )}
    >
      {title && (
        <div className="border-b px-4 py-2.5 text-sm font-medium">{title}</div>
      )}
      <pre
        className={cn(
          "py-3 font-mono text-xs leading-relaxed",
          !wrap && "overflow-x-auto"
        )}
      >
        <code className="block">
          {lines.map((line, index) => (
            <span
              key={index}
              className="code-line"
              data-kind={line.kind}
              data-highlighted={line.highlighted || undefined}
            >
              {showLineNumbers && isDiff && (
                <span className="code-line-number" aria-hidden="true">
                  {lineNumbers[index].before}
                </span>
              )}
              {showLineNumbers && (
                <span className="code-line-number" aria-hidden="true">
                  {lineNumbers[index].after}
                </span>
              )}
              <span
                className="code-line-content"
                // Prism escapes the source; unsupported languages are escaped in highlightCode.
                dangerouslySetInnerHTML={{ __html: line.html || "\n" }}
              />
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}
