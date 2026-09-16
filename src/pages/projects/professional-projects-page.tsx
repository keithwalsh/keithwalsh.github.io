import { Briefcase } from "lucide-react"

import { Page, PageHeader } from "@/components/page"
import data from "@/data/professionalProjects.json"
import { ProjectCard } from "@/pages/projects/project-card"

export default function ProfessionalProjectsPage() {
  return (
    <Page>
      <PageHeader icon={Briefcase} title="Professional Projects" />
      <div className="flex flex-col gap-4">
        {data.projects.map((project) => (
          <ProjectCard
            key={`${project.role}-${project.period}`}
            title={project.role}
            subtitle={`${project.company} · ${project.period}`}
            points={project.achievements}
            technologies={project.technologies}
          />
        ))}
      </div>
    </Page>
  )
}
