import type { ReactNode } from "react"

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
