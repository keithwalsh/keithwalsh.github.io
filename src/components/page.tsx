import type { ReactNode } from "react"
import { useLocation } from "react-router"

import { leadClass, Masthead } from "@/components/editorial"
import { findNavLocation } from "@/config/navigation"
import { cn } from "@/lib/utils"

function Page({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 md:px-6 md:py-8",
        className
      )}
      {...props}
    />
  )
}

/**
 * The title block every page opens with: the masthead and an optional lead.
 * The title defaults to the page's sidebar label, so the masthead matches the
 * breadcrumb and browser tab.
 */
function PageHeader({
  title,
  description,
  aside,
  className,
}: {
  /** A string, or one string per masthead line. */
  title?: string | string[]
  description?: ReactNode
  /** Sits beside the masthead, aligned to its last line. */
  aside?: ReactNode
  className?: string
}) {
  const { pathname } = useLocation()
  const location = findNavLocation(pathname)
  const lines = title ?? location?.item.title ?? ""

  return (
    <header className={cn("flex flex-col", className)}>
      <div className="flex flex-wrap items-end justify-between gap-columns">
        <Masthead
          lines={typeof lines === "string" ? [lines] : lines}
          className="min-w-0 flex-[1_1_26rem]"
        />
        {aside}
      </div>
      {description && (
        <p data-reveal="3" className={cn(leadClass, "pt-stack-sm")}>
          {description}
        </p>
      )}
    </header>
  )
}

export { Page, PageHeader }
