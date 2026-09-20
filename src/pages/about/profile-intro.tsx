import { useRef } from "react"

import {
  leadClass,
  Masthead,
  sectionClass,
  StatusBar,
} from "@/components/editorial"
import { siteConfig } from "@/config/site"
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
        "relative overflow-hidden pt-page-top pb-header-bottom"
      )}
    >
      <StatusBar meta={siteConfig.tagline}>
        Ballindine, Co. Mayo, Ireland
      </StatusBar>

      <div className="flex flex-wrap items-start gap-stack pt-stack">
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
              className="relative block aspect-square w-full rounded-xs object-cover object-[50%_20%] contrast-[1.06] grayscale dark:brightness-90"
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 -bottom-[9px] block h-px border-t border-brand/55"
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-[1_1_18.75rem] flex-col gap-stack-sm">
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
            I build the data layer people decide from. At Portwest I built one
            from scratch: a tested, 104-model dbt project over a global Infor M3
            ERP estate, and an MCP server that lets AI tools read the ERP schema
            safely. Before that, four years of SQL and Python on Snowflake at
            Pitney Bowes, plus internal and client-facing Tableau and Power BI
            dashboards. Fifteen years across payments, risk, client support and
            e-commerce taught me why it matters: when everyone works from one
            trusted source, the argument is about the decision, not the numbers.
          </p>
        </div>
      </div>
    </section>
  )
}
