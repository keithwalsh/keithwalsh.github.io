import { assetUrl } from "@/lib/browser"

export function ProfileIntro() {
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
      <img
        src={assetUrl("photo.jpg")}
        alt="Profile photo of Keith Walsh"
        className="size-40 shrink-0 rounded-full object-cover ring-1 ring-border sm:size-48 dark:brightness-90"
      />
      <blockquote className="border-l-2 pl-6 text-lg leading-relaxed text-muted-foreground italic">
        Data Analyst and Strategic Operations Leader focused on delivering
        actionable insights, automating data workflows, and developing advanced
        data solutions. Skilled at transforming complex datasets into intuitive
        dashboards and analytical reports that drive strategic decisions. Adept
        at collaborating across departments, bridging technical and
        non-technical perspectives, and optimising operations through Python,
        SQL, and leading analytics tools.
      </blockquote>
    </div>
  )
}
