import { ArrowUpRight } from "lucide-react"
import type { IconType } from "react-icons"
import { FaGithub, FaLinkedin, FaStackOverflow } from "react-icons/fa6"

import { NewTabHint, nudgeClass } from "@/components/editorial"
import socialLinks from "@/data/socialLinks.json"
import { cn } from "@/lib/utils"

const ICONS: Record<string, IconType> = {
  github: FaGithub,
  stackoverflow: FaStackOverflow,
  linkedin: FaLinkedin,
}

/**
 * Mono sub-line for a channel row, derived from the href rather than stored a
 * second time in `socialLinks.json`. Drops the scheme and `www.`, and keeps at
 * most two path segments so a long profile slug does not crowd the row.
 */
function handleFor(href: string) {
  const { host, pathname } = new URL(href)
  const segments = pathname.split("/").filter(Boolean).slice(0, 2)
  return [host.replace(/^www\./, ""), ...segments].join("/")
}

export function SocialLinks() {
  return (
    <div className="flex flex-col border-t">
      {socialLinks.links.map((link) => {
        const Icon = ICONS[link.iconKey]

        return (
          // Hover and keyboard focus both nudge the row right as the accent
          // bar appears; the bar is the row's own left border, so the whole
          // row is the hit area.
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              nudgeClass,
              "flex items-center gap-3.5 border-b border-l-2 border-l-transparent py-4 pr-3 outline-none hover:border-l-brand hover:bg-brand-soft focus-visible:border-l-brand focus-visible:bg-brand-soft"
            )}
          >
            {Icon && (
              <Icon aria-hidden="true" className="size-[1.125rem] flex-none" />
            )}
            <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <span className="text-body-sm font-medium">{link.label}</span>
              <span className="truncate font-mono text-xs text-muted-foreground">
                {handleFor(link.href)}
              </span>
            </span>
            <ArrowUpRight className="size-4 flex-none text-muted-foreground" />
            <NewTabHint />
          </a>
        )
      })}
    </div>
  )
}
