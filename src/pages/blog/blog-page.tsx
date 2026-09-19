import { useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { Link } from "react-router"

import {
  eyebrowClass,
  metaClass,
  sectionClass,
  ZeroState,
} from "@/components/editorial"
import { PageHeader } from "@/components/page"
import { formatPostDate, posts } from "@/lib/posts"
import { cn } from "@/lib/utils"
import {
  COUNT_WORDS,
  pad,
  trackRows,
  useReducedMotion,
  useReveal,
  useScrollEffect,
} from "@/pages/about/about-shared"
import {
  rowArrowClass,
  rowDateClass,
  rowLinkClass,
  rowTitleClass,
} from "@/pages/blog/blog-shared"

// Every tag with the number of posts carrying it, most used first; ties keep
// the order they first appear in. Labels, not filters.
const subjects = [
  ...posts
    .flatMap((post) => post.tags)
    .reduce(
      (counts, tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1),
      new Map<string, number>()
    ),
].sort((a, b) => b[1] - a[1])

const drafts = posts.filter((post) => post.draft).length

function countOf(n: number, noun: string) {
  return `${COUNT_WORDS[n] ?? n} ${noun}${n === 1 ? "" : "s"}`
}

export default function BlogPage() {
  if (posts.length === 0) {
    return (
      <ZeroState
        numeral="00"
        lines={["Nothing", "published yet"]}
        action={{ label: "Home page", to: "/" }}
      >
        First write-ups are in progress. They land here when they're ready.
      </ZeroState>
    )
  }

  return <PostIndex />
}

function PostIndex() {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const revealRef = useReveal<HTMLDivElement>(!reduced)
  const rowRefs = useRef<(HTMLLIElement | null)[]>([])
  const progressRef = useRef<HTMLSpanElement>(null)

  // The rail is information, not decoration, so it tracks under reduced
  // motion too.
  useScrollEffect(true, () => {
    setActive(trackRows(rowRefs.current, progressRef.current))
  })

  return (
    // Sections carry their own 1400px container, as on the About route,
    // rather than sitting in the shared `Page` wrapper.
    <div ref={revealRef} className="flex flex-col">
      <section className={cn(sectionClass, "pt-page-top pb-header-bottom")}>
        <PageHeader
          eyebrow={
            <>
              {countOf(posts.length, "write-up")}
              {/* Drafts are only ever listed by the dev server. */}
              {drafts > 0 && (
                <span>
                  ·{" "}
                  {drafts === posts.length
                    ? "all drafts"
                    : countOf(drafts, "draft")}
                </span>
              )}
            </>
          }
          meta={`Last edit ${formatPostDate(posts[0].date, { month: "short" })}`}
          title={["Problems", "worth the detour"]}
          aside={
            subjects.length > 0 && (
              <div
                data-reveal="2"
                className="flex flex-[0_1_20rem] flex-col gap-2.5 pb-1.5"
              >
                <span className={eyebrowClass}>Recurring subjects</span>
                <div className="flex flex-wrap gap-1.5">
                  {subjects.map(([tag, count]) => (
                    <span
                      key={tag}
                      className={cn(
                        metaClass,
                        "rounded-full border px-2.5 py-1.25 text-foreground/85"
                      )}
                    >
                      {tag} · {count}
                    </span>
                  ))}
                </div>
              </div>
            )
          }
          description="Write-ups, mostly from data plumbing and e-commerce systems. Each one started as a problem I could not explain to someone else quickly enough."
        />
      </section>

      <section className={cn(sectionClass, "pb-page-bottom")}>
        {/* `items-stretch` gives the sticky rail its travel, and the two flex
            bases stack rail over list below ~700px of content width. */}
        <div className="flex flex-wrap items-stretch gap-columns">
          <div className="max-w-[21.25rem] min-w-0 flex-[1_1_15rem]">
            <div className="sticky top-24 flex flex-col gap-4.5">
              <div className={eyebrowClass}>01 — Index</div>
              <div className="font-heading text-numeral font-semibold text-brand tabular-nums">
                {pad(active + 1)}
              </div>
              <div className="text-body-sm leading-normal text-pretty text-foreground/85">
                {posts[active].title}
              </div>
              <div className={cn(metaClass, "flex items-center gap-3")}>
                <span>
                  {pad(active + 1)} / {pad(posts.length)}
                </span>
                <span
                  aria-hidden="true"
                  className="relative h-px flex-1 bg-border"
                >
                  <span
                    ref={progressRef}
                    className="absolute inset-y-0 left-0 w-0 bg-brand"
                  />
                </span>
              </div>
              <p className="text-caption leading-normal text-subtle">
                Scroll the index, or open a post to read it.
              </p>
            </div>
          </div>

          <ol className="flex min-w-0 flex-[3_1_26rem] flex-col">
            {posts.map((post, index) => (
              <li
                key={post.slug}
                ref={(el) => {
                  rowRefs.current[index] = el
                }}
                // Stagger the first screen only; rows further down would
                // otherwise wait seconds to appear.
                data-reveal={Math.min(index, 3)}
                className="border-t"
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className={cn(rowLinkClass, "py-row")}
                >
                  <span className={cn(rowDateClass, "pt-1.5")}>
                    {formatPostDate(post.date, {
                      month: "short",
                      year: "2-digit",
                    })}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-2.5">
                    <span className="flex flex-col gap-1.75">
                      <span className={cn(rowTitleClass, "text-title")}>
                        {post.title}
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-px w-full origin-left scale-x-0 bg-brand transition-transform duration-500 ease-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
                      />
                    </span>
                    <span
                      className={cn(
                        metaClass,
                        "flex flex-wrap items-center gap-x-3.5 gap-y-1.5"
                      )}
                    >
                      {index === 0 && (
                        <span className="text-brand">Latest</span>
                      )}
                      {post.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                      {post.draft && <span>Draft</span>}
                    </span>
                    <span className="max-w-[64ch] text-body-sm leading-[1.6] text-pretty text-muted-foreground">
                      {post.summary}
                    </span>
                  </span>
                  <span className="flex flex-none items-center gap-3.5 pt-1">
                    <ArrowUpRight className={rowArrowClass} />
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full bg-muted-foreground/30 transition-all duration-300 group-hover:scale-[1.3] group-hover:bg-brand group-focus-visible:scale-[1.3] group-focus-visible:bg-brand"
                    />
                  </span>
                </Link>
              </li>
            ))}
            <li aria-hidden="true" className="border-t" />
          </ol>
        </div>

        <div
          data-reveal="3"
          className={cn(
            eyebrowClass,
            "flex flex-wrap items-center justify-between gap-4 pt-[clamp(1.75rem,4vw,3rem)]"
          )}
        >
          <span>That is everything. New posts start as drafts.</span>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border-b border-brand/35 pb-0.75 text-brand transition-colors hover:border-brand"
          >
            Tell me I am wrong
            <ArrowUpRight className="size-[0.8125rem]" />
          </Link>
        </div>
      </section>
    </div>
  )
}
