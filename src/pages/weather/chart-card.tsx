import type { ReactNode } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/** A chart with a table-view twin and optional background reading. */
export function ChartCard({
  title,
  description,
  chart,
  table,
  learnMore,
}: {
  title: string
  description?: ReactNode
  chart: ReactNode
  table: ReactNode
  learnMore?: ReactNode
}) {
  return (
    <Card>
      <Tabs defaultValue="chart" className="gap-(--card-spacing)">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
          <CardAction>
            <TabsList>
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <TabsContent value="chart" className="flex flex-col gap-4">
            {chart}
          </TabsContent>
          <TabsContent value="table">{table}</TabsContent>
          {learnMore && (
            <Accordion type="single" collapsible className="border-t">
              <AccordionItem value="learn-more">
                <AccordionTrigger>Learn more</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-3 text-muted-foreground">
                  {learnMore}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </CardContent>
      </Tabs>
    </Card>
  )
}
