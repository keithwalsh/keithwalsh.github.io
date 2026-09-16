import { Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { NavIcon } from "@/config/navigation"

export type ProjectLink = {
  label: string
  href: string
  icon: NavIcon
}

export function ProjectCard({
  title,
  subtitle,
  points,
  technologies = [],
  links = [],
}: {
  title: string
  subtitle?: string
  points: string[]
  technologies?: string[]
  links?: ProjectLink[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
        {links.length > 0 && (
          <CardAction className="flex gap-1">
            {links.map((link) => (
              <Tooltip key={link.href}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" asChild>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                    >
                      <link.icon />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{link.label}</TooltipContent>
              </Tooltip>
            ))}
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ul className="flex flex-col gap-2">
          {points.map((point) => (
            <li key={point} className="flex gap-2.5">
              <Star
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {technologies.map((technology) => (
              <Badge key={technology} variant="outline">
                {technology}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
