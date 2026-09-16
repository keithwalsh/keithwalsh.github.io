import type { ReactNode } from "react"

import type { NavIcon } from "@/config/navigation"
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

function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  icon?: NavIcon
  actions?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="flex min-w-0 flex-col gap-1.5">
        <h1 className="flex items-center gap-2.5 font-heading text-2xl font-semibold tracking-tight">
          {Icon && <Icon className="size-6 shrink-0 text-muted-foreground" />}
          {title}
        </h1>
        {description && (
          <p className="max-w-3xl text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}

function PageSection({
  title,
  description,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"section">, "title"> & {
  title: ReactNode
  description?: ReactNode
}) {
  return (
    <section className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-lg font-semibold tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

export { Page, PageHeader, PageSection }
