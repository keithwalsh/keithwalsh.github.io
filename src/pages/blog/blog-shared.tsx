import type { ReactNode } from "react"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Link } from "react-router"

import { cn } from "@/lib/utils"
import { sectionClass } from "@/pages/about/about-shared"

// Index rows and the post's "Next in the index" row share one hover language:
// the row travels right, date and title warm up, the arrow slides in. Every
// piece also answers `:focus-visible`, so keyboard users get the same cue.
export const rowLinkClass =
  "group flex items-start gap-[clamp(0.75rem,2vw,1.75rem)] transition-[padding-left] duration-350 ease-[cubic-bezier(.2,.8,.2,1)] outline-none hover:pl-2.5 focus-visible:pl-2.5"

export const rowDateClass =
  "w-22 flex-none font-mono text-xs tracking-[0.12em] text-subtle uppercase tabular-nums transition-colors duration-300 group-hover:text-brand group-focus-visible:text-brand"

export const rowTitleClass =
  "font-medium tracking-[-0.025em] text-pretty text-foreground/78 transition-colors duration-300 group-hover:text-foreground group-focus-visible:text-foreground"

export const rowArrowClass =
  "size-4.5 flex-none -translate-x-2 text-brand opacity-0 [transition:opacity_.3s,translate_.35s_cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"

/** Lines that wipe up into place, as on the About and Contact mastheads. */
export function MastheadLines({ lines }: { lines: string[] }) {
  return lines.map((line, index) => (
    <span key={line} className="block overflow-hidden pb-[0.04em]">
      <span
        className="block motion-safe:animate-[masthead-in_1s_cubic-bezier(.16,1,.3,1)_both]"
        style={{ animationDelay: `${0.08 + index * 0.12}s` }}
      >
        {line}
      </span>
    </span>
  ))
}

/**
 * The empty index and a missing post share one composition. Copy is for a
 * reader: in production an all-draft blog is indistinguishable from an empty
 * one.
 */
export function ZeroState({
  numeral,
  lines,
  children,
}: {
  numeral: string
  lines: string[]
  children: ReactNode
}) {
  return (
    <section
      className={cn(
        sectionClass,
        "pt-[clamp(1.75rem,3.5vw,2.75rem)] pb-[clamp(3.5rem,8vw,6.5rem)]"
      )}
    >
      <div className="flex flex-wrap items-start gap-[clamp(1.5rem,4vw,4rem)] pt-[clamp(0.5rem,1.5vw,1.25rem)]">
        <div
          aria-hidden="true"
          className="font-heading text-[clamp(4.5rem,10vw,8.5rem)] leading-[0.82] font-semibold tracking-[-0.05em] text-brand tabular-nums"
        >
          {numeral}
        </div>
        <div className="flex min-w-0 flex-[1_1_22rem] flex-col gap-4.5">
          <h1 className="font-heading text-[clamp(1.75rem,4vw,2.75rem)] leading-[0.95] font-semibold tracking-[-0.04em] uppercase">
            <MastheadLines lines={lines} />
          </h1>
          <p className="max-w-[52ch] text-[clamp(1rem,1.35vw,1.125rem)] leading-[1.6] text-pretty text-foreground/85">
            {children}
          </p>
          {/* The pill pair from the About page's closing row. */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2.5 rounded-full bg-brand px-[1.375rem] py-3.5 text-sm font-semibold tracking-[0.01em] text-brand-foreground transition-colors outline-none hover:bg-brand-hover focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              All posts
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2.5 rounded-full border border-input px-[1.375rem] py-3.5 text-sm font-medium transition-colors outline-none hover:border-brand focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Get in touch
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
