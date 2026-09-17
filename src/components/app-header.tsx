import { Download } from "lucide-react"
import { useLocation } from "react-router"

import { AccessibilityMenu } from "@/components/accessibility-menu"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { findNavLocation } from "@/config/navigation"
import { assetUrl } from "@/lib/browser"

export function AppHeader() {
  const { pathname } = useLocation()
  const location = findNavLocation(pathname)

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur-sm">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-vertical:h-4 data-vertical:self-center"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {location?.section && (
            <>
              <BreadcrumbItem className="hidden md:inline-flex">
                {location.section.title}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage>
              {location?.item.title ?? "Page not found"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-1">
        <Button variant="outline" size="sm" asChild>
          <a href={assetUrl("keith-walsh-cv.pdf")} download>
            <Download />
            CV
          </a>
        </Button>
        <AccessibilityMenu />
        <ModeToggle />
      </div>
    </header>
  )
}
