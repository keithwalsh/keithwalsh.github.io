import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

import { CodeHighlighter } from "@/components/code-highlighter"
import { InlineCode } from "@/components/inline-code"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// No @tailwindcss/typography here; a dozen class strings cover what posts use.
const components: Components = {
  h2: ({ node, ...props }) => (
    <h2
      className="mt-10 font-heading text-xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h3: ({ node, ...props }) => (
    <h3
      className="mt-8 font-heading text-lg font-semibold tracking-tight"
      {...props}
    />
  ),
  p: ({ node, ...props }) => <p className="mt-4 leading-relaxed" {...props} />,
  ul: ({ node, ...props }) => (
    <ul
      className="mt-4 ml-6 flex list-disc flex-col gap-2 marker:text-muted-foreground"
      {...props}
    />
  ),
  ol: ({ node, ...props }) => (
    <ol
      className="mt-4 ml-6 flex list-decimal flex-col gap-2 marker:text-muted-foreground"
      {...props}
    />
  ),
  li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
  a: ({ node, ...props }) => (
    <a
      className="underline underline-offset-4 hover:text-foreground"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="mt-6 border-l-2 pl-4 text-muted-foreground italic"
      {...props}
    />
  ),
  hr: ({ node, ...props }) => <hr className="my-8 border-border" {...props} />,
  table: ({ node, ...props }) => (
    <div className="mt-6 overflow-hidden rounded-lg border">
      <Table {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <TableHeader {...props} />,
  tbody: ({ node, ...props }) => <TableBody {...props} />,
  tr: ({ node, ...props }) => <TableRow {...props} />,
  th: ({ node, ...props }) => <TableHead className="bg-muted/50" {...props} />,
  td: ({ node, ...props }) => <TableCell {...props} />,
  // CodeHighlighter renders a <div>, which cannot legally sit inside a <pre>.
  pre: ({ children }) => <>{children}</>,
  code: ({ node, className, children, ...props }) => {
    const language = /language-(\w+)/.exec(className ?? "")?.[1]

    if (!language) {
      return <InlineCode {...props}>{children}</InlineCode>
    }

    return (
      <CodeHighlighter
        className="my-6"
        code={String(children).replace(/\n$/, "")}
        language={language}
        annotations={false}
      />
    )
  },
}

export function PostBody({ body }: { body: string }) {
  return (
    <div className="max-w-3xl">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {body}
      </ReactMarkdown>
    </div>
  )
}
