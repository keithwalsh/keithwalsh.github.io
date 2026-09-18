import { useState } from "react"

import { PageHeader } from "@/components/page"
import {
  DEFAULT_FIELDS,
  formatCronExpression,
  parseCronExpression,
  type CronFieldKey,
  type CronFields,
} from "@/pages/tools/cron-expressions/cron"
import { CronExpressionBar } from "@/pages/tools/cron-expressions/cron-expression-bar"
import { CronFieldEditor } from "@/pages/tools/cron-expressions/cron-field-editor"
import {
  CronLegend,
  CronPresets,
} from "@/pages/tools/cron-expressions/cron-presets"
import { CronSentence } from "@/pages/tools/cron-expressions/cron-sentence"

export default function CronExpressionsPage() {
  const [fields, setFields] = useState<CronFields>(DEFAULT_FIELDS)
  const [active, setActive] = useState<CronFieldKey>("minutes")
  // Hovering a token, tab or sentence segment highlights its fields in all three.
  const [hover, setHover] = useState<CronFieldKey[]>([])

  return (
    <div className="@container flex flex-1 flex-col">
      <div className="grid flex-1 grid-rows-[auto_1fr] @4xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] @4xl:grid-rows-none">
        <div className="flex min-w-0 flex-col gap-6 p-4 @md:p-8 @4xl:border-r @4xl:border-foreground/8 @4xl:pr-7 @4xl:pb-7">
          <PageHeader
            title="Cron Expressions"
            description="Build, check and decode cron schedules."
          />

          <div className="flex flex-col gap-3.5">
            <CronSentence
              fields={fields}
              active={active}
              hover={hover}
              onHoverChange={setHover}
            />
            <CronExpressionBar
              fields={fields}
              active={active}
              hover={hover}
              onActiveChange={setActive}
              onHoverChange={setHover}
              onFieldsChange={setFields}
            />
          </div>

          <CronPresets
            expression={formatCronExpression(fields)}
            onSelect={(cron) => setFields(parseCronExpression(cron) ?? fields)}
            className="mt-auto"
          />
          <CronLegend />
        </div>

        <CronFieldEditor
          fields={fields}
          active={active}
          hover={hover}
          onActiveChange={setActive}
          onHoverChange={setHover}
          onFieldChange={(key, value) =>
            setFields((current) => ({ ...current, [key]: value }))
          }
          className="border-t border-foreground/8 @4xl:border-t-0"
        />
      </div>
    </div>
  )
}
