import type { ComponentType } from "react"
import { ChartColumn, House, Mail, PenLine, Rocket, Wrench } from "lucide-react"

import { siteConfig } from "@/config/site"

export type NavIcon = ComponentType<{ className?: string }>

// Section items render label-only in the sidebar, so only top-level rows
// (primary items and sections) carry an icon.
export type NavItem = {
  title: string
  url: string
}

export type PrimaryNavItem = NavItem & {
  icon: NavIcon
}

export type NavSection = {
  title: string
  icon: NavIcon
  items: NavItem[]
}

export const primaryNav: PrimaryNavItem[] = [
  { title: "About", url: "/", icon: House },
  { title: "Blog", url: "/blog", icon: PenLine },
  { title: "Contact", url: "/contact", icon: Mail },
]

export const sectionNav: NavSection[] = [
  {
    title: "Tools",
    icon: Wrench,
    items: [
      { title: "Browser Mockup", url: "/tools/browser-mockup" },
      { title: "Code Annotator", url: "/tools/code-annotator" },
      { title: "Cron Expressions", url: "/tools/cron-expressions" },
      { title: "JSON Explorer", url: "/tools/json-explorer" },
      { title: "Markdown Table", url: "/tools/markdown-table" },
      { title: "Text to ASCII", url: "/tools/text-to-ascii" },
      ...(siteConfig.showTestPage
        ? [{ title: "Test Page", url: "/test-page" }]
        : []),
    ],
  },
  {
    title: "Visualizations",
    icon: ChartColumn,
    items: [{ title: "Weather", url: "/visualizations/weather" }],
  },
  {
    title: "Projects",
    icon: Rocket,
    items: [
      { title: "Professional", url: "/projects/professional" },
      { title: "Personal", url: "/projects/personal" },
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
