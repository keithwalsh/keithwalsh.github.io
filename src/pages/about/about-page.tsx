import { Page, PageHeader } from "@/components/page"
import { EducationCerts } from "@/pages/about/education-certs"
import { ProfessionalJourney } from "@/pages/about/professional-journey"
import { ProfileIntro } from "@/pages/about/profile-intro"
import { SkillList } from "@/pages/about/skill-list"

export default function AboutPage() {
  return (
    <Page className="gap-12">
      <PageHeader title="About Me" />
      <ProfileIntro />
      <ProfessionalJourney />
      <SkillList />
      <EducationCerts />
    </Page>
  )
}
