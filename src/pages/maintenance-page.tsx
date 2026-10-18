import {
  Masthead,
  StatusBar,
  leadClass,
  sectionClass,
} from "@/components/editorial"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

/** Shown in place of the whole site while `siteConfig.online` is false. */
export default function MaintenancePage() {
  return (
    <main
      className={cn(
        sectionClass,
        "flex min-h-svh flex-col justify-center gap-4.5 py-page-top"
      )}
    >
      <StatusBar meta={siteConfig.domain}>Offline</StatusBar>
      <Masthead lines={[siteConfig.name]} />
      <p className={leadClass}>
        This site is offline for now. Please check back soon.
      </p>
    </main>
  )
}
