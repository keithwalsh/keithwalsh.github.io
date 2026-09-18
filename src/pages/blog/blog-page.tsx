import { useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { Link } from "react-router"

import { formatPostDate, posts } from "@/lib/posts"
import { cn } from "@/lib/utils"
import {
  COUNT_WORDS,
  eyebrowClass,
  pad,
  sectionClass,
  trackRows,
  useReducedMotion,
  useReveal,
  useScrollEffect,
} from "@/pages/about/about-shared"
import {
  MastheadLines,
  rowArrowClass,
  rowDateClass,
  rowLinkClass,
  rowTitleClass,
  ZeroState,
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
      <ZeroState numeral="00" lines={["Nothing", "published yet"]}>
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
      <section
        className={cn(
          sectionClass,
          "pt-[clamp(1.75rem,3.5vw,2.75rem)] pb-[clamp(2.25rem,5vw,4rem)]"
        )}
      >
        <div
          data-reveal="0"
          className="flex flex-wrap items-center justify-between gap-3 border-b pb-3.5 font-mono text-[0.65625rem] tracking-[0.2em] text-muted-foreground uppercase"
        >
          <span className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="block size-1.25 rounded-full bg-cron-accent motion-safe:animate-[halo_2.6s_ease-in-out_infinite]"
            />
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
          </span>
          <span>
            Last edit {formatPostDate(posts[0].date, { month: "short" })}
          </span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-[clamp(1.5rem,3vw,3rem)] pt-[clamp(1.5rem,3vw,2.5rem)]">
          <h1 className="min-w-0 flex-[1_1_26rem] font-heading text-[clamp(2.5rem,6vw,3.875rem)] leading-[0.92] font-semibold tracking-[-0.04em] uppercase">
            <MastheadLines lines={["Problems", "worth the detour"]} />
          </h1>
          {subjects.length > 0 && (
            <div
              data-reveal="2"
              className="flex flex-[0_1_20rem] flex-col gap-2.5 pb-1.5"
            >
              <span className="font-mono text-[0.65625rem] tracking-[0.2em] text-muted-foreground uppercase">
                Recurring subjects
              </span>
              <div className="flex flex-wrap gap-1.5">
                {subjects.map(([tag, count]) => (
                  <span
                    key={tag}
                    className="rounded-full border px-2.5 py-1.25 font-mono text-[0.65625rem] tracking-[0.1em] text-foreground/85 uppercase"
                  >
                    {tag} · {count}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <p
          data-reveal="3"
          className="max-w-[56ch] pt-[clamp(1rem,2vw,1.375rem)] text-[clamp(1rem,1.35vw,1.15625rem)] leading-[1.6] text-pretty text-foreground/85"
        >
          Write-ups, mostly from data plumbing and e-commerce systems. Each one
          started as a problem I could not explain to someone else quickly
          enough.
        </p>
      </section>

      <section className={cn(sectionClass, "pb-[clamp(3.5rem,8vw,6.5rem)]")}>
        {/* `items-stretch` gives the sticky rail its travel, and the two flex
            bases stack rail over list below ~700px of content width. */}
        <div className="flex flex-wrap items-stretch gap-[clamp(1.25rem,3vw,3.5rem)]">
          <div className="max-w-[21.25rem] min-w-0 flex-[1_1_15rem]">
            <div className="sticky top-24 flex flex-col gap-4.5">
              <div className={eyebrowClass}>01 — Index</div>
              <div className="font-heading text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.9] font-semibold tracking-[-0.04em] text-cron-accent tabular-nums">
                {pad(active + 1)}
              </div>
              <div className="text-[0.9375rem] leading-normal text-pretty text-foreground/85">
                {posts[active].title}
              </div>
              <div className="flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground">
                <span>
                  {pad(active + 1)} / {pad(posts.length)}
                </span>
                <span
                  aria-hidden="true"
                  className="relative h-px flex-1 bg-border"
                >
                  <span
                    ref={progressRef}
                    className="absolute inset-y-0 left-0 w-0 bg-cron-accent"
                  />
                </span>
              </div>
              <p className="text-[0.8125rem] leading-normal text-cron-subtle">
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
                  className={cn(
                    rowLinkClass,
                    "py-[clamp(1.125rem,2vw,1.625rem)]"
                  )}
                >
                  <span className={cn(rowDateClass, "pt-1.5")}>
                    {formatPostDate(post.date, {
                      month: "short",
                      year: "2-digit",
                    })}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-2.5">
                    <span className="flex flex-col gap-1.75">
                      <span
                        className={cn(
                          rowTitleClass,
                          "text-[clamp(1.25rem,2.4vw,1.875rem)] leading-[1.12]"
                        )}
                      >
                        {post.title}
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-px w-full origin-left scale-x-0 bg-cron-accent transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                      />
                    </span>
                    <span className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 font-mono text-[0.65625rem] tracking-[0.14em] text-muted-foreground uppercase">
                      {index === 0 && (
                        <span className="text-cron-accent">Latest</span>
                      )}
                      {post.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                      {post.draft && <span>Draft</span>}
                    </span>
                    <span className="max-w-[64ch] text-[0.9375rem] leading-[1.6] text-pretty text-muted-foreground">
                      {post.summary}
                    </span>
                  </span>
                  <span className="flex flex-none items-center gap-3.5 pt-1">
                    <ArrowUpRight className={rowArrowClass} />
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full bg-muted-foreground/30 transition-all duration-300 group-hover:scale-[1.3] group-hover:bg-cron-accent group-focus-visible:scale-[1.3] group-focus-visible:bg-cron-accent"
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
          className="flex flex-wrap items-center justify-between gap-4 pt-[clamp(1.75rem,4vw,3rem)] font-mono text-[0.65625rem] tracking-[0.18em] text-muted-foreground uppercase"
        >
          <span>That is everything. New posts start as drafts.</span>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border-b border-cron-accent/35 pb-0.75 text-cron-accent transition-colors hover:border-cron-accent"
          >
            Tell me I am wrong
            <ArrowUpRight className="size-[0.8125rem]" />
          </Link>
        </div>
      </section>
    </div>
  )
}
