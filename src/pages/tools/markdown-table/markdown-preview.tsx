import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

import { InlineCode } from "@/components/inline-code"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const components: Components = {
  table: ({ node, ...props }) => <Table {...props} />,
  thead: ({ node, ...props }) => <TableHeader {...props} />,
  tbody: ({ node, ...props }) => <TableBody {...props} />,
  tr: ({ node, ...props }) => <TableRow {...props} />,
  th: ({ node, ...props }) => <TableHead className="bg-muted/50" {...props} />,
  td: ({ node, ...props }) => <TableCell {...props} />,
  code: ({ node, ...props }) => <InlineCode {...props} />,
}

/** Renders the generated Markdown the way a GFM renderer would. */
export function MarkdownPreview({ markdown }: { markdown: string }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
