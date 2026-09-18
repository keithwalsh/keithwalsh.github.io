import { ExternalLink } from "lucide-react"
import { FaGithub } from "react-icons/fa6"

import { Page, PageHeader } from "@/components/page"
import data from "@/data/personalProjects.json"
import { ProjectCard, type ProjectLink } from "@/pages/projects/project-card"

export default function PersonalProjectsPage() {
  return (
    <Page>
      <PageHeader title="Personal Projects" />
      <div className="flex flex-col gap-4">
        {data.projects.map((project) => {
          const links: ProjectLink[] = [
            { label: "View source", href: project.repoUrl, icon: FaGithub },
          ]
          if (project.demoUrl) {
            links.push({
              label: "Live demo",
              href: project.demoUrl,
              icon: ExternalLink,
            })
          }

          return (
            <ProjectCard
              key={project.title}
              title={project.title}
              points={project.points}
              technologies={project.technologies}
              links={links}
            />
          )
        })}
      </div>
    </Page>
  )
}
