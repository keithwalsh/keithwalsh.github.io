import { Page, PageHeader } from "@/components/page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactForm } from "@/pages/contact/contact-form"
import { SocialLinks } from "@/pages/contact/social-links"

export default function ContactPage() {
  return (
    <Page>
      <PageHeader title="Let's Connect" />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Card>
          <CardHeader>
            <CardTitle>You can find me here</CardTitle>
          </CardHeader>
          <CardContent>
            <SocialLinks />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Or send me a message</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </Page>
  )
}
