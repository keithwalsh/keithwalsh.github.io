import type { ComponentType } from "react"
import {
  AppWindow,
  Braces,
  Briefcase,
  CalendarClock,
  ChartColumn,
  CloudSun,
  CodeXml,
  Coffee,
  FlaskConical,
  House,
  Mail,
  Rocket,
  Table,
  Type,
  Wrench,
} from "lucide-react"

export type NavIcon = ComponentType<{ className?: string }>

export type NavItem = {
  title: string
  url: string
  icon: NavIcon
}

export type NavSection = {
  title: string
  icon: NavIcon
  items: NavItem[]
}

export const primaryNav: NavItem[] = [
  { title: "About", url: "/", icon: House },
  { title: "Contact", url: "/contact", icon: Mail },
]

export const sectionNav: NavSection[] = [
  {
    title: "Visualizations",
    icon: ChartColumn,
    items: [
      { title: "Weather", url: "/visualizations/weather", icon: CloudSun },
    ],
  },
  {
    title: "Tools",
    icon: Wrench,
    items: [
      {
        title: "Browser Mockup",
        url: "/tools/browser-mockup",
        icon: AppWindow,
      },
      { title: "Code Annotator", url: "/tools/code-annotator", icon: CodeXml },
      {
        title: "Cron Expressions",
        url: "/tools/cron-expressions",
        icon: CalendarClock,
      },
      { title: "JSON Explorer", url: "/tools/json-explorer", icon: Braces },
      { title: "Markdown Table", url: "/tools/markdown-table", icon: Table },
      { title: "Text to ASCII", url: "/tools/text-to-ascii", icon: Type },
      { title: "Test Page", url: "/test-page", icon: FlaskConical },
    ],
  },
  {
    title: "Projects",
    icon: Rocket,
    items: [
      { title: "Professional", url: "/projects/professional", icon: Briefcase },
      { title: "Personal", url: "/projects/personal", icon: Coffee },
    ],
  },
]

export function findNavLocation(pathname: string) {
  const primary = primaryNav.find((item) => item.url === pathname)
  if (primary) {
    return { item: primary, section: undefined }
  }

  for (const section of sectionNav) {
    const item = section.items.find((entry) => entry.url === pathname)
    if (item) {
      return { item, section }
    }
  }

  return null
}
