import { Briefcase } from "lucide-react"

import { Page, PageHeader } from "@/components/page"
import journey from "@/data/professionalJourney.json"
import { ProjectCard } from "@/pages/projects/project-card"

// Roles live in professionalJourney.json so the About timeline and this page
// can never disagree about dates.
export default function ProfessionalProjectsPage() {
  return (
    <Page>
      <PageHeader icon={Briefcase} title="Professional Projects" />
      <div className="flex flex-col gap-4">
        {journey.positions.map((position) => (
          <ProjectCard
            key={`${position.company}-${position.dateRange}`}
            title={position.title}
            subtitle={`${position.company}, ${position.location} · ${position.dateRange}`}
            points={position.details}
            technologies={position.technologies}
          />
        ))}
      </div>
    </Page>
  )
}
