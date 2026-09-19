import type { ReactNode } from "react"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Link } from "react-router"

import { cn } from "@/lib/utils"

/** The editorial routes widen past the shared `Page` container to 1400px. */
export const sectionClass = "mx-auto w-full max-w-[87.5rem] px-gutter"

/** Mono section label, e.g. `01 — Professional Journey`. */
export const eyebrowClass =
  "font-mono text-eyebrow text-muted-foreground uppercase"

/** Mono detail line, e.g. a role's location or a post's tags. */
export const metaClass = "font-mono text-meta text-muted-foreground uppercase"

/** The intro paragraph under a masthead. */
export const leadClass = "max-w-[56ch] text-lead text-pretty text-foreground/85"

/** Rows that step right on hover and keyboard focus, e.g. the blog index. */
export const nudgeClass =
  "transition-[padding-left,background-color,border-color] duration-300 ease-glide hover:pl-2.5 focus-visible:pl-2.5"

/** Inline text links: a quiet underline that firms up on hover. */
export const linkClass =
  "underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"

/** Unordered lists: the About timeline's brand dash in place of a disc. */
export const dashListClass =
  "*:relative *:pl-6.5 *:before:absolute *:before:top-[0.5lh] *:before:left-0 *:before:h-px *:before:w-3.5 *:before:bg-brand"

/** A primary action's fill, on `Button` or a link. `--primary` stays neutral. */
export const brandFillClass =
  "bg-brand text-brand-foreground hover:bg-brand-hover"

/** Call-to-action pills, e.g. "Download CV" beside "Get in touch". */
export const brandPillClass =
  "inline-flex items-center gap-2.5 rounded-full bg-brand px-[1.375rem] py-3.5 text-sm font-semibold text-brand-foreground transition-colors outline-none hover:bg-brand-hover focus-visible:ring-3 focus-visible:ring-ring/50"
export const outlinePillClass =
  "inline-flex items-center gap-2.5 rounded-full border border-input px-[1.375rem] py-3.5 text-sm font-medium transition-colors outline-none hover:border-brand focus-visible:ring-3 focus-visible:ring-ring/50"

/** Tells screen-reader users that a link opens a new tab. */
export function NewTabHint() {
  return <span className="sr-only"> (opens in a new tab)</span>
}

/** The ruled status line above a masthead, led by a pulsing brand dot. */
export function StatusBar({
  children,
  meta,
}: {
  children: ReactNode
  /** Pushed to the far end of the line. */
  meta?: ReactNode
}) {
  return (
    <div
      data-reveal="0"
      className={cn(
        eyebrowClass,
        "flex flex-wrap items-center justify-between gap-3 border-b pb-3.5"
      )}
    >
      <span className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="block size-1.25 rounded-full bg-brand motion-safe:animate-halo"
        />
        {children}
      </span>
      {meta && <span>{meta}</span>}
    </div>
  )
}

/** An uppercase page title whose lines wipe up into place. */
export function Masthead({
  lines,
  className,
}: {
  lines: string[]
  className?: string
}) {
  return (
    <h1
      className={cn(
        "font-heading text-display font-semibold uppercase",
        className
      )}
    >
      {lines.map((line, index) => (
        <span key={line} className="block overflow-hidden pb-[0.04em]">
          <span
            className="block motion-safe:animate-masthead-in"
            style={{ animationDelay: `${0.08 + index * 0.12}s` }}
          >
            {line}
          </span>
        </span>
      ))}
    </h1>
  )
}

/**
 * The site's page-level empty state: the 404 page, a missing post and the
 * empty blog index. Copy is for a reader: in production an all-draft blog is
 * indistinguishable from an empty one.
 */
export function ZeroState({
  numeral,
  lines,
  action,
  children,
}: {
  numeral: string
  lines: string[]
  /** The filled pill, usually one level up; "Get in touch" always follows. */
  action: { label: string; to: string }
  children: ReactNode
}) {
  return (
    <section className={cn(sectionClass, "pt-page-top pb-page-bottom")}>
      <div className="flex flex-wrap items-start gap-columns pt-[clamp(0.5rem,1.5vw,1.25rem)]">
        <div
          aria-hidden="true"
          className="font-heading text-numeral-lg font-semibold text-brand tabular-nums"
        >
          {numeral}
        </div>
        <div className="flex min-w-0 flex-[1_1_22rem] flex-col gap-4.5">
          <Masthead lines={lines} />
          <p className={leadClass}>{children}</p>
          {/* The pill pair from the About page's closing row. */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link to={action.to} className={brandPillClass}>
              {action.label}
              <ArrowRight className="size-4" />
            </Link>
            <Link to="/contact" className={outlinePillClass}>
              Get in touch
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
