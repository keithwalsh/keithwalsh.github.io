import { useMemo, type Ref } from "react"

import "@/components/code-highlighter.css"
import { highlightCode } from "@/lib/code-highlight"
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
              {showLineNumbers && (
                <span className="code-line-number" aria-hidden="true">
                  {index + 1}
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
