import type { ReactNode } from "react"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Link } from "react-router"

import { cn } from "@/lib/utils"

/** The editorial routes widen past the shared `Page` container to 1400px. */
export const sectionClass =
  "mx-auto w-full max-w-[87.5rem] px-[clamp(1.25rem,4vw,3.5rem)]"

/** Mono section label, e.g. `01 — Professional Journey`. */
export const eyebrowClass =
  "font-mono text-eyebrow text-muted-foreground uppercase"

/** The intro paragraph under a masthead. */
export const leadClass =
  "max-w-[56ch] text-[clamp(1rem,1.35vw,1.15625rem)] leading-[1.6] text-pretty text-foreground/85"

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
      className="flex flex-wrap items-center justify-between gap-3 border-b pb-3.5 font-mono text-eyebrow text-muted-foreground uppercase"
    >
      <span className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="block size-1.25 rounded-full bg-brand motion-safe:animate-[halo_2.6s_ease-in-out_infinite]"
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
            className="block motion-safe:animate-[masthead-in_1s_cubic-bezier(.16,1,.3,1)_both]"
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
          <Masthead lines={lines} />
          <p className={leadClass}>{children}</p>
          {/* The pill pair from the About page's closing row. */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <Link
              to={action.to}
              className="inline-flex items-center gap-2.5 rounded-full bg-brand px-[1.375rem] py-3.5 text-sm font-semibold tracking-[0.01em] text-brand-foreground transition-colors outline-none hover:bg-brand-hover focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {action.label}
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
