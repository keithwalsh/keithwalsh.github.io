import { useRef } from "react"

import { assetUrl } from "@/lib/browser"
import {
  sectionClass,
  useReducedMotion,
  useReveal,
  useScrollEffect,
} from "@/pages/about/about-shared"
import { cn } from "@/lib/utils"

const NAME_LINES = ["Keith", "Walsh"]

export function ProfileIntro() {
  const reduced = useReducedMotion()
  const revealRef = useReveal<HTMLElement>(!reduced)
  const portraitRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useScrollEffect(!reduced, () => {
    const y = window.scrollY || 0
    if (portraitRef.current) {
      const scale = 1 + Math.min(y, 600) * 0.00012
      portraitRef.current.style.transform = `translateY(${(y * -0.07).toFixed(1)}px) scale(${scale.toFixed(4)})`
    }
    if (glowRef.current) {
      glowRef.current.style.transform = `translate3d(0,${(y * 0.16).toFixed(1)}px,0)`
    }
  })

  return (
    // `overflow-hidden` clips the portrait glow. Do not add it to an ancestor
    // of the journey section — it breaks that section's sticky rail.
    <section
      ref={revealRef}
      className={cn(
        sectionClass,
        "relative overflow-hidden pt-[clamp(1.75rem,3.5vw,2.75rem)] pb-[clamp(2.25rem,5vw,4rem)]"
      )}
    >
      <div
        data-reveal="0"
        className="flex flex-wrap items-center justify-between gap-3 border-b pb-3.5 font-mono text-[0.65625rem] tracking-[0.2em] text-muted-foreground uppercase"
      >
        <span className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="block size-[0.3125rem] rounded-full bg-brand motion-safe:animate-[halo_2.6s_ease-in-out_infinite]"
          />
          Ballindine, Co. Mayo, Ireland
        </span>
      </div>

      <div className="flex flex-wrap items-start gap-[clamp(1.25rem,3vw,2.75rem)] pt-[clamp(1.5rem,3vw,2.5rem)]">
        <div className="relative w-[clamp(7.25rem,15vw,10.5rem)] flex-none">
          <div
            ref={glowRef}
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-[34%] -top-[28%] -bottom-[18%] rounded-full bg-[radial-gradient(circle_at_50%_45%,var(--brand-strong),transparent_70%)] blur-[8px]"
          />
          <div ref={portraitRef} className="relative w-full">
            <img
              src={assetUrl("photo.jpg")}
              alt="Keith Walsh"
              className="relative block aspect-square w-full rounded-[3px] object-cover object-[50%_20%] contrast-[1.06] grayscale dark:brightness-90"
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 -bottom-[9px] block h-px border-t border-brand/55"
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-[1_1_18.75rem] flex-col gap-[clamp(0.875rem,1.6vw,1.25rem)]">
          <h1 className="font-heading text-[clamp(1.875rem,3.7vw,3.125rem)] leading-none font-semibold tracking-[-0.04em] uppercase">
            {NAME_LINES.map((line, index) => (
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

          <div
            data-reveal="2"
            className="flex flex-wrap items-center gap-2.5 font-mono text-[0.71875rem] tracking-[0.14em] text-foreground/85 uppercase"
          >
            <span>Data Analyst</span>
            <span aria-hidden="true" className="h-px w-[1.125rem] bg-brand" />
            <span>Strategic Operations</span>
          </div>

          <p
            data-reveal="3"
            className="mt-0.5 max-w-[56ch] text-[clamp(1rem,1.35vw,1.15625rem)] leading-[1.6] text-pretty text-foreground/85"
          >
            I turn messy operational data into things people actually use —
            pipelines that run themselves, dashboards that answer the question,
            and reports that end the argument. Fifteen years across payments,
            risk, client support and e-commerce, usually sitting between the
            technical team and the people waiting on an answer.
          </p>
        </div>
      </div>
    </section>
  )
}
