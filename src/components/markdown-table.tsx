import { useEffect, useMemo } from "react"

import { CodeHighlighter } from "@/components/code-highlighter"
import {
  generateMarkdownTable,
  type MarkdownTableOptions,
} from "@/lib/markdown-table"

export type MarkdownTableProps = MarkdownTableOptions & {
  /** Outer arrays are rows; inner arrays are cells. */
  inputData?: string[][] | null
  showLineNumbers?: boolean
  className?: string
  onGenerate?: (markdown: string) => void
}

/** Renders structured data as Markdown table syntax in a code block. */
export function MarkdownTable({
  inputData,
  columnAlignments,
  hasHeader,
  isCompact,
  hasTabs,
  hasPadding,
  convertLineBreaks,
  showLineNumbers = true,
  className,
  onGenerate,
}: MarkdownTableProps) {
  const markdown = useMemo(
    () =>
      generateMarkdownTable(inputData ?? [], {
        columnAlignments,
        hasHeader,
        isCompact,
        hasTabs,
        hasPadding,
        convertLineBreaks,
      }),
    [
      inputData,
      columnAlignments,
      hasHeader,
      isCompact,
      hasTabs,
      hasPadding,
      convertLineBreaks,
    ]
  )

  useEffect(() => {
    onGenerate?.(markdown)
  }, [markdown, onGenerate])

  return (
    <CodeHighlighter
      code={markdown}
      language="markdown"
      annotations={false}
      wrap={false}
      showLineNumbers={showLineNumbers}
      className={className}
    />
  )
}
