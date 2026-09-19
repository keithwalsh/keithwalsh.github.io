import { eyebrowClass, sectionClass } from "@/components/editorial"
import { PageHeader } from "@/components/page"
import { cn } from "@/lib/utils"
import { useReducedMotion, useReveal } from "@/pages/about/about-shared"
import { ContactForm } from "@/pages/contact/contact-form"
import { SocialLinks } from "@/pages/contact/social-links"

const MASTHEAD_LINES = ["Let's", "Connect"]

/** Mono section label with a rule that sweeps out to fill the row. */
function SectionEyebrow({ label, delay }: { label: string; delay: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className={eyebrowClass}>{label}</span>
      <span
        aria-hidden="true"
        className="h-px flex-1 origin-left bg-border motion-safe:animate-rule-in"
        style={{ animationDelay: delay }}
      />
    </div>
  )
}

export default function ContactPage() {
  const reduced = useReducedMotion()
  const revealRef = useReveal<HTMLElement>(!reduced)

  return (
    // The 1400px frame and padding of the About and Blog sections.
    <section
      ref={revealRef}
      className={cn(sectionClass, "pt-page-top pb-page-bottom")}
    >
      <PageHeader title={MASTHEAD_LINES} />

      <div className="grid grid-cols-1 items-start pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-x-14">
        <div data-reveal="0" className="flex min-w-0 flex-col gap-5">
          <SectionEyebrow label="01 — Find me" delay="0.6s" />
          <SocialLinks />
        </div>

        {/* The rule sits in the middle of the 56px gutter: the negative margin
            pulls the column back so its content starts at the gutter's edge.
            Stacked below `lg` there is no rule — the channel list already ends
            in a hairline, so a second one reads as a double rule. */}
        <div
          data-reveal="1"
          className="mt-10 flex min-w-0 flex-col gap-5 lg:mt-0 lg:-ml-14 lg:border-l lg:pl-14"
        >
          <SectionEyebrow label="02 — Send a message" delay="0.68s" />
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
