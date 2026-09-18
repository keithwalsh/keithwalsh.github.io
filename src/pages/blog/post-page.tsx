import { useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ArrowUpRight } from "lucide-react"
import { Link, useOutletContext, useParams } from "react-router"

import { formatPostDate, posts } from "@/lib/posts"
import { cn } from "@/lib/utils"
import {
  eyebrowClass,
  pad,
  sectionClass,
  useReducedMotion,
  useReveal,
  useScrollEffect,
} from "@/pages/about/about-shared"
import {
  rowArrowClass,
  rowDateClass,
  rowLinkClass,
  rowTitleClass,
  ZeroState,
} from "@/pages/blog/blog-shared"
import { PostBody } from "@/pages/blog/post-body"

export default function PostPage() {
  const { slug } = useParams()
  const index = posts.findIndex((post) => post.slug === slug)

  if (index === -1) {
    return (
      <ZeroState numeral="404" lines={["Post not", "in the index"]}>
        That URL does not match a published post. It may have been a draft, or
        the slug changed.
      </ZeroState>
    )
  }

  // Keyed by slug so moving to the next post replays the entrance and resets
  // the Contents rail rather than reusing this post's state.
  return <Post key={slug} index={index} />
}

function Post({ index }: { index: number }) {
  const post = posts[index]
  const next = posts[index + 1]
  const header = useOutletContext<HTMLElement | null>()
  const reduced = useReducedMotion()
  const revealRef = useReveal<HTMLDivElement>(!reduced)
  const articleRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const [activeSection, setActiveSection] = useState(0)

  // The `##` headings PostBody numbers, skipping fenced code so a `## ` line
  // inside a code sample is not mistaken for one.
  const sections = [
    ...post.body.replace(/^```[\s\S]*?^```/gm, "").matchAll(/^## (.+)$/gm),
  ].map(([, title]) => title.replace(/[`*]/g, "").trim())
  const minutes = Math.max(1, Math.round(post.body.split(/\s+/).length / 200))

  const sectionNodes = () =>
    articleRef.current?.querySelectorAll<HTMLElement>("[data-section]") ?? []

  // Progress and the active section are information, not decoration, so they
  // track under reduced motion too.
  useScrollEffect(true, () => {
    if (progressRef.current) {
      const span = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      )
      const done = Math.min(1, Math.max(0, window.scrollY / span))
      progressRef.current.style.width = `${(done * 100).toFixed(2)}%`
    }

    let current = 0
    sectionNodes().forEach((section, i) => {
      if (section.getBoundingClientRect().top < window.innerHeight * 0.32) {
        current = i
      }
    })
    setActiveSection(current)
  })

  const jump = (i: number) => {
    const section = sectionNodes()[i]
    if (!section) return
    // The section's `scroll-mt-24` clears the sticky header.
    section.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })
    // Move focus too, as following an in-page link would.
    section.querySelector("h2")?.focus({ preventScroll: true })
  }

  return (
    <div ref={revealRef} className="flex flex-col">
      {/* Reading progress rides the header's bottom border. There is no
          header, so no hairline, under `?notoolbar`. */}
      {header &&
        createPortal(
          <span
            ref={progressRef}
            aria-hidden="true"
            className="absolute -bottom-px left-0 h-0.5 w-0 bg-cron-accent transition-[width] duration-100 ease-linear"
          />,
          header
        )}

      <section
        className={cn(
          sectionClass,
          "pt-[clamp(1.25rem,2.5vw,1.875rem)] pb-[clamp(2rem,4vw,3.25rem)]"
        )}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 font-mono text-[0.65625rem] tracking-[0.2em] text-muted-foreground uppercase">
          <span className="text-cron-accent">Post {pad(index + 1)}</span>
          <span>{formatPostDate(post.date)}</span>
          <span>{minutes} min read</span>
          {post.draft && (
            <span className="rounded-full border px-2.25 py-1 tracking-[0.14em]">
              Draft
            </span>
          )}
          <span
            aria-hidden="true"
            className="h-px min-w-10 flex-1 origin-left bg-border motion-safe:animate-[rule-in_0.9s_cubic-bezier(.16,1,.3,1)_both]"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        {/* Titles are sentences, so they wipe in word by word rather than by
            line. The space stays inside each clipped word: between
            inline-blocks it would collapse. */}
        <h1 className="max-w-[26ch] pt-[clamp(0.875rem,1.6vw,1.25rem)] font-heading text-[clamp(2rem,4.6vw,3.25rem)] leading-none font-semibold tracking-[-0.035em] text-pretty">
          {post.title.split(" ").map((word, i, words) => (
            <span
              key={i}
              className="inline-block overflow-hidden pb-[0.06em] align-bottom"
            >
              <span
                className="inline-block motion-safe:animate-[masthead-in_0.9s_cubic-bezier(.16,1,.3,1)_both]"
                style={{ animationDelay: `${0.06 * (i + 1)}s` }}
              >
                {word}
                {i < words.length - 1 && " "}
              </span>
            </span>
          ))}
        </h1>

        <p className="max-w-[58ch] pt-[clamp(1rem,2vw,1.5rem)] text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.6] text-pretty text-foreground/85">
          {post.summary}
        </p>
      </section>

      <section className={cn(sectionClass, "pb-[clamp(3.5rem,8vw,6.5rem)]")}>
        {/* `items-stretch` gives the sticky rail its travel. */}
        <div className="flex flex-wrap items-stretch gap-[clamp(1.5rem,4vw,4.5rem)]">
          {sections.length > 0 && (
            <div className="max-w-[13rem] min-w-0 flex-[1_1_11rem]">
              <nav
                aria-label="Contents"
                className="sticky top-24 flex flex-col gap-3.5"
              >
                <div className={eyebrowClass}>Contents</div>
                <div className="flex flex-col gap-0.5">
                  {sections.map((title, i) => {
                    const isActive = i === activeSection

                    return (
                      <button
                        key={i}
                        type="button"
                        aria-current={isActive ? "location" : undefined}
                        onClick={() => jump(i)}
                        className={cn(
                          "flex items-start gap-2.5 py-1.75 text-left font-mono text-[0.65625rem] tracking-[0.12em] uppercase transition-colors duration-300 hover:text-foreground",
                          isActive ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "mt-1.5 h-px w-3.5 flex-none origin-left bg-cron-accent transition-[scale,opacity] duration-350",
                            isActive
                              ? "scale-x-100 opacity-100"
                              : "scale-x-35 opacity-40"
                          )}
                        />
                        {title}
                      </button>
                    )
                  })}
                </div>
              </nav>
            </div>
          )}

          <article
            ref={articleRef}
            className="max-w-[70ch] min-w-0 flex-[3_1_28rem] text-[1.0625rem] leading-[1.7] text-foreground/92"
          >
            <PostBody body={post.body} />

            {next && (
              <div className="mt-[clamp(2.75rem,5vw,4.5rem)] border-t border-foreground pt-4.5">
                <div className={cn(eyebrowClass, "text-[0.65625rem]")}>
                  Next in the index
                </div>
                <Link
                  to={`/blog/${next.slug}`}
                  className={cn(rowLinkClass, "pt-5")}
                >
                  <span className={cn(rowDateClass, "pt-1.25")}>
                    {formatPostDate(next.date, {
                      month: "short",
                      year: "2-digit",
                    })}
                  </span>
                  <span
                    className={cn(
                      rowTitleClass,
                      "min-w-0 flex-1 text-[clamp(1.125rem,1.9vw,1.5rem)] leading-[1.15]"
                    )}
                  >
                    {next.title}
                  </span>
                  <ArrowUpRight className={cn(rowArrowClass, "mt-1.25")} />
                </Link>
              </div>
            )}
          </article>
        </div>
      </section>
    </div>
  )
}
