import { useId, useRef, useState } from "react"

import journey from "@/data/professionalJourney.json"
import { cn } from "@/lib/utils"
import {
  eyebrowClass,
  pad,
  sectionClass,
  trackRows,
  useReducedMotion,
  useScrollEffect,
} from "@/pages/about/about-shared"

const { positions } = journey

export function ProfessionalJourney() {
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState<number | null>(null)
  const reduced = useReducedMotion()
  const rowRefs = useRef<(HTMLLIElement | null)[]>([])
  const progressRef = useRef<HTMLSpanElement>(null)
  const panelId = useId()

  const open = pinned ?? active
  const current = positions[open]

  useScrollEffect(!reduced, () => {
    setActive(trackRows(rowRefs.current, progressRef.current))
  })

  return (
    <section className={cn(sectionClass, "py-[clamp(3rem,6vw,6rem)]")}>
      {/* `items-stretch` is what gives the sticky rail its travel. */}
      <div className="flex flex-wrap items-stretch gap-[clamp(1.25rem,3vw,3.5rem)]">
        <div className="max-w-[21.25rem] min-w-0 flex-[1_1_10.625rem]">
          <div className="sticky top-24 flex flex-col gap-[1.125rem]">
            <div className={eyebrowClass}>01 — Professional Journey</div>
            <div className="font-heading text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.9] font-semibold tracking-[-0.04em] text-brand tabular-nums">
              {current.year}
            </div>
            <div className="text-[0.9375rem] leading-normal text-foreground/85">
              {current.title} · {current.company}
            </div>
            <div className="flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground">
              <span>
                {pad(open + 1)} / {pad(positions.length)}
              </span>
              <span
                aria-hidden="true"
                className="relative h-px flex-1 bg-border"
              >
                <span
                  ref={progressRef}
                  className="absolute inset-y-0 left-0 w-0 bg-brand"
                />
              </span>
            </div>
            <p className="text-[0.8125rem] leading-normal text-subtle">
              Scroll, or select a role to pin it open.
            </p>
          </div>
        </div>

        <ol className="flex min-w-0 flex-[3_1_22.5rem] flex-col">
          {positions.map((position, index) => {
            const isOpen = index === open

            return (
              <li
                key={`${position.year}-${position.title}`}
                ref={(el) => {
                  rowRefs.current[index] = el
                }}
                className="border-t"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${panelId}-${index}`}
                  onClick={() => {
                    setPinned(pinned === index ? null : index)
                    setActive(index)
                  }}
                  className="flex w-full items-baseline gap-[clamp(0.75rem,2vw,1.75rem)] py-[clamp(1.125rem,2vw,1.625rem)] text-left transition-[padding-left] duration-350 ease-[cubic-bezier(.2,.8,.2,1)] outline-none hover:pl-2.5 focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <span
                    className={cn(
                      "flex-none font-mono text-xs tracking-[0.12em] tabular-nums transition-colors duration-300",
                      isOpen ? "text-brand" : "text-subtle"
                    )}
                  >
                    {position.year}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-[5px]">
                    <span
                      className={cn(
                        "text-[clamp(1.25rem,2.4vw,1.875rem)] leading-[1.12] font-medium tracking-[-0.025em] text-pretty transition-colors duration-300",
                        isOpen ? "text-foreground" : "text-foreground/72"
                      )}
                    >
                      {position.title}
                    </span>
                    <span className="font-mono text-[0.71875rem] tracking-[0.12em] text-muted-foreground uppercase">
                      {position.company}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-2 flex-none rounded-full transition-all duration-300",
                      isOpen
                        ? "scale-[1.3] bg-brand"
                        : "scale-100 bg-muted-foreground/30"
                    )}
                  />
                </button>

                <div
                  id={`${panelId}-${index}`}
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    opacity: isOpen ? 1 : 0,
                  }}
                  className="grid [transition:grid-template-rows_.55s_cubic-bezier(.2,.8,.2,1),opacity_.4s] motion-reduce:[transition:none]"
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-4 pb-[clamp(1.5rem,3vw,2.25rem)] pl-[clamp(0px,4vw,4rem)]">
                      <div className="flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[0.6875rem] tracking-[0.1em] text-muted-foreground uppercase">
                        <span>{position.dateRange}</span>
                        <span>{position.location}</span>
                      </div>
                      <p className="max-w-[66ch] text-[0.9375rem] leading-[1.6] text-pretty text-muted-foreground">
                        {position.companyDescription}{" "}
                        {position.companyDescription2}
                      </p>
                      <ul className="flex max-w-[72ch] flex-col gap-2.5">
                        {position.details.map((detail) => (
                          <li
                            key={detail}
                            className="flex gap-3 text-[0.9375rem] leading-[1.55] text-pretty text-foreground/90"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[0.5625rem] h-px w-3.5 flex-none bg-brand"
                            />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {position.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border px-2.5 py-[5px] font-mono text-[0.65625rem] tracking-[0.1em] text-foreground/85 uppercase"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
          <li className="border-t" />
        </ol>
      </div>
    </section>
  )
}
