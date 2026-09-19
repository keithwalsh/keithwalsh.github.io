import { dashListClass } from "@/components/editorial"
import { IconButton } from "@/components/icon-button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { NavIcon } from "@/config/navigation"
import { cn } from "@/lib/utils"

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
              <IconButton
                key={link.href}
                label={link.label}
                aria-label={`${link.label} (opens in a new tab)`}
                asChild
              >
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <link.icon />
                </a>
              </IconButton>
            ))}
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ul className={cn(dashListClass, "flex flex-col gap-2")}>
          {points.map((point) => (
            <li key={point}>{point}</li>
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
