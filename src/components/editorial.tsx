import { cn } from "@/lib/utils"

/** The editorial routes widen past the shared `Page` container to 1400px. */
export const sectionClass =
  "mx-auto w-full max-w-[87.5rem] px-[clamp(1.25rem,4vw,3.5rem)]"

/** Mono section label, e.g. `01 — Professional Journey`. */
export const eyebrowClass =
  "font-mono text-eyebrow text-muted-foreground uppercase"

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
