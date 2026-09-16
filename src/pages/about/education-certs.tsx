import { Award, GraduationCap } from "lucide-react"

import { PageSection } from "@/components/page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import certData from "@/data/certifications.json"

export function EducationCerts() {
  return (
    <PageSection title="Education & Certifications">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="size-4 text-muted-foreground" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">B.Sc. Engineering with Management</p>
            <p className="text-muted-foreground">
              Trinity College Dublin, 2010
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="size-4 text-muted-foreground" />
              Recent Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {certData.certifications.map((cert) => (
              <div key={cert.title}>
                <p className="font-medium">{cert.title}</p>
                <p className="text-muted-foreground">
                  {cert.issuer}, {cert.year}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageSection>
  )
}
