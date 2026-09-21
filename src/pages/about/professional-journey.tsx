import { useId, useRef, useState } from "react"

import {
  dashListClass,
  eyebrowClass,
  metaClass,
  nudgeClass,
  sectionClass,
} from "@/components/editorial"
import journey from "@/data/professionalJourney.json"
import { cn } from "@/lib/utils"
import {
  pad,
  trackRows,
  useReducedMotion,
  useScrollEffect,
} from "@/pages/about/about-shared"

// The year marker is read off `dateRange`, so the two can never disagree.
const positions = journey.positions.map((position) => ({
  ...position,
  year: /\d{4}/.exec(position.dateRange)?.[0] ?? "",
}))

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

  if (!current) return null

  return (
    <section className={cn(sectionClass, "py-section")}>
      {/* `items-stretch` is what gives the sticky rail its travel. */}
      <div className="flex flex-wrap items-stretch gap-columns">
        <div className="max-w-[21.25rem] min-w-0 flex-[1_1_10.625rem]">
          <div className="sticky top-24 flex flex-col gap-[1.125rem]">
            <div className={eyebrowClass}>01 — Professional Journey</div>
            <div className="font-heading text-numeral font-semibold text-brand tabular-nums">
              {current.year}
            </div>
            <div className="text-body-sm leading-normal text-foreground/85">
              {current.title} · {current.company}
            </div>
            <div className={cn(metaClass, "flex items-center gap-3")}>
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
            <p className="text-caption leading-normal text-subtle">
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
                  className={cn(
                    nudgeClass,
                    "flex w-full items-baseline gap-cells py-row text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  )}
                >
                  <span
                    className={cn(
                      "flex-none font-mono text-meta tabular-nums transition-colors duration-300",
                      isOpen ? "text-brand" : "text-subtle"
                    )}
                  >
                    {position.year}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-[5px]">
                    <span
                      className={cn(
                        "text-title font-medium text-pretty transition-colors duration-300",
                        isOpen ? "text-foreground" : "text-foreground/72"
                      )}
                    >
                      {position.title}
                    </span>
                    <span className={metaClass}>{position.company}</span>
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
                  className="grid transition-[grid-template-rows,opacity] duration-500 ease-glide motion-reduce:transition-none"
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-4 pb-stack pl-[clamp(0px,4vw,4rem)]">
                      <div
                        className={cn(
                          metaClass,
                          "flex flex-wrap gap-x-5 gap-y-1.5"
                        )}
                      >
                        <span>{position.dateRange}</span>
                        <span>{position.location}</span>
                      </div>
                      <p className="max-w-[66ch] text-body-sm leading-[1.6] text-pretty text-muted-foreground">
                        {position.companyDescription}{" "}
                        {position.companyDescription2}
                      </p>
                      <ul
                        className={cn(
                          dashListClass,
                          "flex max-w-[72ch] flex-col gap-2.5"
                        )}
                      >
                        {position.details.map((detail) => (
                          <li
                            key={detail}
                            className="text-body-sm leading-[1.55] text-pretty text-foreground/90"
                          >
                            {detail}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {position.technologies.map((tech) => (
                          <span
                            key={tech}
                            className={cn(
                              metaClass,
                              "rounded-full border px-2.5 py-1.25 text-foreground/85"
                            )}
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
