import { useRef } from "react"

import {
  leadClass,
  Masthead,
  sectionClass,
  StatusBar,
} from "@/components/editorial"
import journey from "@/data/professionalJourney.json"
import { assetUrl } from "@/lib/browser"
import {
  useReducedMotion,
  useReveal,
  useScrollEffect,
} from "@/pages/about/about-shared"
import { cn } from "@/lib/utils"

const NAME_LINES = ["Keith", "Walsh"]
// The newest role, so the line under the name can't drift from the timeline.
const [currentRole] = journey.positions

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
      <StatusBar>Ballindine, Co. Mayo, Ireland</StatusBar>

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
          <Masthead lines={NAME_LINES} />

          <div
            data-reveal="2"
            className="flex flex-wrap items-center gap-2.5 font-mono text-meta text-foreground/85 uppercase"
          >
            <span>{currentRole.title}</span>
            <span aria-hidden="true" className="h-px w-[1.125rem] bg-brand" />
            <span>{currentRole.company}</span>
          </div>

          <p data-reveal="3" className={cn(leadClass, "mt-0.5")}>
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
