import { useRef } from "react"
import type { IconType } from "react-icons"
import {
  SiCss,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNodedotjs,
  SiPhp,
  SiPython,
  SiReact,
  SiTypescript,
} from "react-icons/si"

import {
  eyebrowClass,
  metaClass,
  nudgeClass,
  sectionClass,
} from "@/components/editorial"
import skillsData from "@/data/skills.json"
import { cn } from "@/lib/utils"
import { COUNT_WORDS, useReducedMotion } from "@/pages/about/about-shared"

const ICONS: Record<string, IconType> = {
  python: SiPython,
  database: SiMysql,
  javascript: SiJavascript,
  typescript: SiTypescript,
  php: SiPhp,
  html: SiHtml5,
  css: SiCss,
  react: SiReact,
  node: SiNodedotjs,
}

export function SkillList() {
  const reduced = useReducedMotion()
  const { skills } = skillsData
  const total = String(skills.length).padStart(2, "0")

  return (
    <section className={cn(sectionClass, "flex flex-col gap-stack py-section")}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className={eyebrowClass}>02 — Skills &amp; Expertise</div>
        <div className="font-mono text-meta text-subtle">
          {total} / {COUNT_WORDS[skills.length] ?? skills.length}
        </div>
      </div>

      <div>
        {skills.map((skill, index) => (
          <SkillRow
            key={skill.name}
            skill={skill}
            index={index}
            magnetic={!reduced}
          />
        ))}
        <div className="border-t" />
      </div>
    </section>
  )
}

function SkillRow({
  skill,
  index,
  magnetic,
}: {
  skill: (typeof skillsData.skills)[number]
  index: number
  magnetic: boolean
}) {
  const iconRef = useRef<HTMLSpanElement>(null)
  const Icon = ICONS[skill.iconKey]

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!magnetic || !iconRef.current) return
    const box = event.currentTarget.getBoundingClientRect()
    const dx = (event.clientX - box.left) / box.width - 0.5
    const dy = (event.clientY - box.top) / box.height - 0.5
    iconRef.current.style.transform = `translate(${(dx * 14).toFixed(2)}px,${(dy * 10).toFixed(2)}px) scale(1.18)`
  }

  const reset = () => {
    if (iconRef.current) iconRef.current.style.transform = ""
  }

  return (
    <div
      onPointerMove={move}
      onPointerLeave={reset}
      className={cn(
        nudgeClass,
        "flex flex-wrap items-center gap-cells border-t py-row hover:bg-brand-soft"
      )}
    >
      <span className={cn(metaClass, "flex-[0_0_1.75rem] text-subtle")}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        ref={iconRef}
        className="flex-none transition-transform duration-300"
      >
        {Icon && <Icon aria-hidden="true" className="block size-[1.625rem]" />}
      </span>
      <span className="min-w-[7.5rem] flex-[0_1_11.25rem] text-subtitle font-medium">
        {skill.name}
      </span>
      <span className={cn(metaClass, "min-w-[6.875rem] flex-[0_1_10rem]")}>
        {skill.category}
      </span>
      <span className="min-w-[12.5rem] flex-[2_1_18.75rem] text-body-sm leading-normal text-pretty text-muted-foreground">
        {skill.context}
      </span>
    </div>
  )
}
