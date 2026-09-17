import { EducationCerts } from "@/pages/about/education-certs"
import { ProfessionalJourney } from "@/pages/about/professional-journey"
import { ProfileIntro } from "@/pages/about/profile-intro"
import { SkillList } from "@/pages/about/skill-list"

export default function AboutPage() {
  return (
    // Sections carry their own 1400px container and padding rather than the
    // shared `Page` wrapper — this route is wider than the rest of the site.
    <div className="flex flex-col">
      <ProfileIntro />
      <ProfessionalJourney />
      <SkillList />
      <EducationCerts />
    </div>
  )
}
