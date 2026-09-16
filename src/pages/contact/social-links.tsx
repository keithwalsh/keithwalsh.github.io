import { ArrowUpRight } from "lucide-react"
import type { IconType } from "react-icons"
import { FaGithub, FaLinkedin, FaStackOverflow } from "react-icons/fa6"

import { Button } from "@/components/ui/button"
import socialLinks from "@/data/socialLinks.json"

const ICONS: Record<string, IconType> = {
  github: FaGithub,
  stackoverflow: FaStackOverflow,
  linkedin: FaLinkedin,
}

export function SocialLinks() {
  return (
    <div className="flex flex-col gap-2">
      {socialLinks.links.map((link) => {
        const Icon = ICONS[link.iconKey]

        return (
          <Button
            key={link.href}
            variant="outline"
            size="lg"
            className="justify-start"
            asChild
          >
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {Icon && <Icon aria-hidden="true" />}
              {link.label}
              <ArrowUpRight className="ml-auto text-muted-foreground" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </Button>
        )
      })}
    </div>
  )
}
