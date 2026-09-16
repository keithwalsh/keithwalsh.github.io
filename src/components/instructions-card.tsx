import type { ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function InstructionsCard({
  title,
  steps,
  className,
}: {
  title: string
  steps: ReactNode[]
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="ml-4 flex list-decimal flex-col gap-1.5 text-muted-foreground">
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
