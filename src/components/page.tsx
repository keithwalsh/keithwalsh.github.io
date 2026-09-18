import type { ReactNode } from "react"
import { useLocation } from "react-router"

import { leadClass, Masthead, StatusBar } from "@/components/editorial"
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
 * The title block every page opens with: a status line, the masthead and an
 * optional lead. The status line defaults to the page's sidebar section, and
 * is left out when there is neither.
 */
function PageHeader({
  title,
  eyebrow,
  meta,
  description,
  aside,
  className,
}: {
  /** A string, or one string per masthead line. */
  title: string | string[]
  eyebrow?: ReactNode
  meta?: ReactNode
  description?: ReactNode
  /** Sits beside the masthead, aligned to its last line. */
  aside?: ReactNode
  className?: string
}) {
  const { pathname } = useLocation()
  const label = eyebrow ?? findNavLocation(pathname)?.section?.title

  return (
    <header className={cn("flex flex-col", className)}>
      {label && <StatusBar meta={meta}>{label}</StatusBar>}
      <div
        className={cn(
          "flex flex-wrap items-end justify-between gap-[clamp(1.5rem,3vw,3rem)]",
          label && "pt-[clamp(1.5rem,3vw,2.5rem)]"
        )}
      >
        <Masthead
          lines={typeof title === "string" ? [title] : title}
          className="min-w-0 flex-[1_1_26rem]"
        />
        {aside}
      </div>
      {description && (
        <p
          data-reveal="3"
          className={cn(leadClass, "pt-[clamp(1rem,2vw,1.375rem)]")}
        >
          {description}
        </p>
      )}
    </header>
  )
}

export { Page, PageHeader }
