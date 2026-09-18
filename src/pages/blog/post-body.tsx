import { memo } from "react"
import type { Root } from "hast"
import { Copy } from "lucide-react"
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
import { copyWithToast } from "@/lib/browser"

// No @tailwindcss/typography here; a dozen class strings cover what posts use.
const components: Components = {
  // Each h2 opens a ruled, numbered section. The post page's Contents rail
  // scroll-spies `data-section`; the numeral comes from the `section` counter
  // that `PostBody` resets.
  h2: ({ node, ...props }) => (
    <div
      data-section
      className="mt-[clamp(2.25rem,4vw,3.5rem)] flex scroll-mt-24 items-baseline gap-3.5 border-t pt-5 [counter-increment:section]"
    >
      <span
        aria-hidden="true"
        className="font-mono text-meta text-brand tabular-nums before:content-[counter(section,decimal-leading-zero)]"
      />
      <h2
        tabIndex={-1}
        className="font-heading text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.2] font-semibold tracking-[-0.025em] outline-none"
        {...props}
      />
    </div>
  ),
  h3: ({ node, ...props }) => (
    <h3
      className="mt-8 font-heading text-lg font-semibold tracking-tight"
      {...props}
    />
  ),
  p: ({ node, ...props }) => (
    <p className="mt-4.5 text-pretty first:mt-0" {...props} />
  ),
  // The About timeline's accent dash stands in for a disc.
  ul: ({ node, ...props }) => (
    <ul
      className="mt-5 flex max-w-[68ch] flex-col gap-3 *:relative *:pl-7 *:before:absolute *:before:top-3.5 *:before:left-0 *:before:h-px *:before:w-3.5 *:before:bg-brand"
      {...props}
    />
  ),
  ol: ({ node, ...props }) => (
    <ol
      className="mt-4 ml-6 flex list-decimal flex-col gap-2 marker:text-muted-foreground"
      {...props}
    />
  ),
  li: ({ node, ...props }) => <li className="text-pretty" {...props} />,
  strong: ({ node, ...props }) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
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

    const code = String(children).replace(/\n$/, "")

    return (
      <figure className="mt-6 mb-5.5 overflow-hidden rounded-lg border bg-muted/40">
        <figcaption className="flex items-center justify-between gap-3 border-b px-3 py-2.25 font-mono text-meta text-muted-foreground uppercase">
          {/* Text after the fence's language names the file:
              ```tsx professional-projects-page.tsx */}
          <span className="min-w-0 truncate">
            {node?.data?.meta || language}
          </span>
          <CopyButton text={code} />
        </figcaption>
        <CodeHighlighter
          code={code}
          language={language}
          annotations={false}
          className="rounded-none border-0 bg-transparent"
        />
      </figure>
    )
  },
}

function CopyButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => copyWithToast(text, "Code copied")}
      className="inline-flex flex-none items-center gap-1.5 rounded-full border bg-background px-2.25 py-1 text-meta uppercase transition-colors outline-none hover:border-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Copy className="size-3" />
      Copy
    </button>
  )
}

/** Tags the paragraphs above the first h2 — the lead-in — to fade in. */
function rehypeLeadIn() {
  return (tree: Root) => {
    let index = 0
    for (const node of tree.children) {
      if (node.type !== "element") continue
      if (node.tagName === "h2") return
      if (node.tagName === "p") node.properties.dataReveal = index++
    }
  }
}

// Memoised: the post page re-renders as the Contents rail tracks scrolling,
// and re-parsing the Markdown each time would be wasted work.
export const PostBody = memo(function PostBody({ body }: { body: string }) {
  return (
    <div className="[counter-reset:section]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeLeadIn]}
        components={components}
      >
        {body}
      </ReactMarkdown>
    </div>
  )
})
