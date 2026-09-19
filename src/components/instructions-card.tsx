import type { ReactNode } from "react"

import { dashListClass } from "@/components/editorial"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function InstructionsCard({
  title,
  steps,
  ordered = true,
  className,
}: {
  title: string
  steps: ReactNode[]
  /** Number the steps; turn off for tips that have no order. */
  ordered?: boolean
  className?: string
}) {
  const items = steps.map((step, index) => <li key={index}>{step}</li>)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {ordered ? (
          <ol className="ml-4 flex list-decimal flex-col gap-1.5 text-muted-foreground">
            {items}
          </ol>
        ) : (
          <ul
            className={cn(
              dashListClass,
              "flex flex-col gap-1.5 text-muted-foreground"
            )}
          >
            {items}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
