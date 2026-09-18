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
  PenLine,
  Rocket,
  Table,
  Type,
  Wrench,
} from "lucide-react"

import { siteConfig } from "@/config/site"

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
  { title: "Blog", url: "/blog", icon: PenLine },
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
      ...(siteConfig.showTestPage
        ? [{ title: "Test Page", url: "/test-page", icon: FlaskConical }]
        : []),
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
  const entries: { item: NavItem; section?: NavSection }[] = [
    ...primaryNav.map((item) => ({ item, section: undefined })),
    ...sectionNav.flatMap((section) =>
      section.items.map((item) => ({ item, section }))
    ),
  ]

  const exact = entries.find((entry) => entry.item.url === pathname)
  if (exact) {
    return exact
  }

  // Nested routes such as /blog/:slug fall back to their closest parent entry,
  // so they still get a breadcrumb and a document title.
  return (
    entries
      .filter((entry) => pathname.startsWith(`${entry.item.url}/`))
      .sort((a, b) => b.item.url.length - a.item.url.length)[0] ?? null
  )
}
