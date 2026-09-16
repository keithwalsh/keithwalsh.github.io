import type { IconType } from "react-icons"
import { FaDatabase } from "react-icons/fa6"
import {
  SiCss,
  SiHtml5,
  SiJavascript,
  SiNodedotjs,
  SiPhp,
  SiPython,
  SiReact,
  SiTypescript,
} from "react-icons/si"

import { PageSection } from "@/components/page"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import skillsData from "@/data/skills.json"

const ICONS: Record<string, IconType> = {
  python: SiPython,
  database: FaDatabase,
  javascript: SiJavascript,
  typescript: SiTypescript,
  php: SiPhp,
  html: SiHtml5,
  css: SiCss,
  react: SiReact,
  node: SiNodedotjs,
}

export function SkillList() {
  return (
    <PageSection title="Skills & Expertise">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillsData.skills.map((skill) => {
          const Icon = ICONS[skill.iconKey]

          return (
            <Card key={skill.name} size="sm">
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  {Icon && (
                    <Icon
                      aria-hidden="true"
                      className="size-8 shrink-0"
                      style={{ color: skill.color }}
                    />
                  )}
                  <div className="flex min-w-0 flex-col">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-muted-foreground">
                      {skill.category}
                    </span>
                  </div>
                </div>
                <Progress
                  value={skill.level}
                  aria-label={`${skill.name} proficiency: ${skill.level}%`}
                />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </PageSection>
  )
}
