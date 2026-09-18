import { Suspense, useEffect, useState } from "react"
import { Outlet, useLocation, useSearchParams } from "react-router"

import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"
import { findNavLocation, notFoundTitle } from "@/config/navigation"
import { siteConfig } from "@/config/site"
import { trackPageView } from "@/lib/analytics"

// The sidebar component persists its open state in this cookie.
function readSidebarCookie() {
  const match = document.cookie.match(/(?:^|; )sidebar_state=(true|false)/)
  return match ? match[1] === "true" : true
}

export function AppLayout() {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const [defaultOpen] = useState(readSidebarCookie)
  // Handed to routes as outlet context so they can portal into the header;
  // null while `?notoolbar` hides it, so nothing portals then.
  const [header, setHeader] = useState<HTMLElement | null>(null)
  // `?notoolbar` hides the header, e.g. when a tool is embedded elsewhere.
  const hideHeader = searchParams.has("notoolbar")

  useEffect(() => {
    const title = findNavLocation(pathname)?.item.title ?? notFoundTitle
    document.title =
      pathname === "/"
        ? `${siteConfig.name} — ${siteConfig.tagline}`
        : `${title} · ${siteConfig.name}`
    window.scrollTo(0, 0)
    trackPageView(pathname)
  }, [pathname])

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        {hideHeader ? (
          <div className="sticky top-0 z-20 h-0">
            <SidebarTrigger className="m-2 bg-background/80 opacity-70 hover:opacity-100" />
          </div>
        ) : (
          <AppHeader ref={setHeader} />
        )}
        <Suspense fallback={<PageFallback />}>
          <Outlet context={header} />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}

function PageFallback() {
  return (
    <div className="flex flex-1 items-center justify-center p-12 text-muted-foreground">
      <Spinner className="size-6" />
    </div>
  )
}
