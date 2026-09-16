import { useState } from "react"
import { Calendar, ChevronDown, MapPin } from "lucide-react"

import { PageSection } from "@/components/page"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import journey from "@/data/professionalJourney.json"
import { cn } from "@/lib/utils"

export function ProfessionalJourney() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const { positions } = journey

  return (
    <PageSection
      title="Professional Journey"
      description="Select a role to see what it involved."
    >
      <ol className="flex flex-col">
        {positions.map((position, index) => {
          const id = `${position.year}-${position.title}`
          const isFirst = index === 0
          const isLast = index === positions.length - 1

          return (
            <li
              key={id}
              className="grid grid-cols-[3rem_1rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[3.5rem_1rem_minmax(0,1fr)]"
            >
              <span className="pt-2.5 text-right text-sm font-medium text-muted-foreground tabular-nums">
                {position.year}
              </span>

              <div className="relative flex justify-center" aria-hidden="true">
                <span
                  className={cn(
                    "absolute inset-y-0 w-px bg-border",
                    isFirst && "top-4",
                    isLast && "bottom-auto h-4"
                  )}
                />
                <span
                  className={cn(
                    "relative mt-3.5 size-2.5 rounded-full ring-4 ring-background",
                    isFirst ? "bg-primary" : "bg-muted-foreground/50"
                  )}
                />
              </div>

              <Collapsible
                open={expanded === id}
                onOpenChange={(open) => setExpanded(open ? id : null)}
                className="pb-3"
              >
                <CollapsibleTrigger className="group flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2 text-left outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50">
                  <span className="flex flex-col">
                    <span className="font-medium">{position.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {position.company}
                    </span>
                  </span>
                  <ChevronDown className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <div className="mx-3 mt-2 flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 text-sm">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        {position.dateRange}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        {position.location}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {position.companyDescription}{" "}
                      {position.companyDescription2}
                    </p>
                    <ul className="ml-4 flex list-disc flex-col gap-1.5 marker:text-muted-foreground">
                      {position.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </li>
          )
        })}
      </ol>
    </PageSection>
  )
}
