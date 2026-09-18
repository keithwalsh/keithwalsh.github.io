export type Post = {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
  /** Drafts are listed in dev and hidden from the production build. */
  draft: boolean
  body: string
}

// Vite inlines every post at build time, so the blog stays a static bundle.
const files = import.meta.glob("/src/content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

function parsePost(path: string, raw: string): Post {
  const matched = FRONTMATTER.exec(raw)
  const fields: Record<string, string> = {}

  for (const line of matched?.[1].split(/\r?\n/) ?? []) {
    const separator = line.indexOf(":")
    if (separator > 0) {
      fields[line.slice(0, separator).trim()] = line
        .slice(separator + 1)
        .trim()
        // Unwrap only a fully quoted value; a value that merely opens with a
        // quote (a quotation) keeps its punctuation.
        .replace(/^(["'])([\s\S]*)\1$/, "$2")
    }
  }

  return {
    slug: path.split("/").pop()!.replace(/\.md$/, ""),
    title: fields.title ?? "Untitled",
    date: fields.date ?? "",
    summary: fields.summary ?? "",
    tags: fields.tags ? fields.tags.split(",").map((tag) => tag.trim()) : [],
    draft: fields.draft === "true",
    body: raw.slice(matched?.[0].length ?? 0).trim(),
  }
}

export const posts = Object.entries(files)
  .map(([path, raw]) => parsePost(path, raw))
  .filter((post) => import.meta.env.DEV || !post.draft)
  .sort((a, b) => b.date.localeCompare(a.date))

/** `17 September 2026` by default; pass options for shorter forms. */
export function formatPostDate(
  date: string,
  options?: Intl.DateTimeFormatOptions
) {
  const parsed = new Date(date)
  return Number.isNaN(parsed.valueOf())
    ? date
    : parsed
        .toLocaleDateString("en-IE", {
          day: "numeric",
          month: "long",
          year: "numeric",
          // Dates are calendar days parsed as UTC midnight; formatting in the
          // reader's zone would show the day before anywhere west of UTC.
          timeZone: "UTC",
          ...options,
        })
        // en-IE abbreviates September as "Sept"; the index's date column
        // is sized for three-letter months.
        .replace(/\bSept\b/, "Sep")
}
