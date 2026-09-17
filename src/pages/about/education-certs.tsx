import { ArrowDown, ArrowUpRight } from "lucide-react"
import { Link } from "react-router"

import certData from "@/data/certifications.json"
import { assetUrl } from "@/lib/browser"
import { cn } from "@/lib/utils"
import {
  eyebrowClass,
  sectionClass,
  useReducedMotion,
  useReveal,
} from "@/pages/about/about-shared"

const EDUCATION = {
  kicker: "Education",
  title: "B.Sc. Engineering with Management",
  meta: "Trinity College Dublin, 2010",
}

export function EducationCerts() {
  const reduced = useReducedMotion()
  const revealRef = useReveal<HTMLElement>(!reduced)

  const cells = [
    EDUCATION,
    ...certData.certifications.map((cert) => ({
      kicker: `Certification — ${cert.year}`,
      title: cert.title,
      meta: cert.issuer,
    })),
  ]

  return (
    <section
      ref={revealRef}
      className={cn(
        sectionClass,
        "flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)] pb-[clamp(4rem,8vw,7.5rem)]"
      )}
    >
      <div className={eyebrowClass}>03 — Education &amp; Certifications</div>

      {/* The 1px grid gap over a border-coloured background draws the dividers. */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(16.25rem,1fr))] gap-px overflow-hidden rounded-[6px] border bg-border">
        {cells.map((cell, index) => (
          <div
            key={cell.title}
            data-reveal={index}
            className="flex flex-col gap-3 bg-background p-[clamp(1.375rem,2.5vw,2rem)]"
          >
            <div className="font-mono text-[0.65625rem] tracking-[0.18em] text-muted-foreground uppercase">
              {cell.kicker}
            </div>
            <div className="text-[clamp(1.125rem,1.9vw,1.375rem)] leading-[1.25] font-medium tracking-[-0.02em] text-pretty">
              {cell.title}
            </div>
            <div className="text-sm text-muted-foreground">{cell.meta}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        {/* Hover lightens the accent in dark mode and darkens it in light, so
            the `text-background` ink keeps its contrast either way. */}
        <a
          href={assetUrl("keith-walsh-cv.pdf")}
          download
          className="inline-flex items-center gap-2.5 rounded-full bg-cron-accent px-[1.375rem] py-3.5 text-sm font-semibold tracking-[0.01em] text-background transition-colors outline-none hover:bg-[oklch(0.4_0.15_264)] focus-visible:ring-3 focus-visible:ring-ring/50 dark:hover:bg-[oklch(0.8_0.13_264)]"
        >
          Download CV
          <ArrowDown className="size-4" />
        </a>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2.5 rounded-full border border-input px-[1.375rem] py-3.5 text-sm font-medium transition-colors outline-none hover:border-cron-accent focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Get in touch
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
