import { Link, useLocation } from "react-router"
import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { primaryNav, sectionNav } from "@/config/navigation"
import { siteConfig } from "@/config/site"
import { assetUrl } from "@/lib/browser"
import { cn } from "@/lib/utils"

// The current page gets a soft accent tint instead of the primitive's solid
// fill, and keeps it under hover.
const activeClass =
  "data-active:bg-brand-soft data-active:font-medium data-active:text-brand data-active:hover:bg-brand-soft data-active:hover:text-brand"

// Primary pages and the Explore section parents share one row shape.
const rowClass = cn(
  "h-8.5 gap-2.5 px-2.5 text-sidebar-foreground/82",
  activeClass
)

export function AppSidebar() {
  const { pathname } = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()

  // The mobile sidebar is a sheet, so close it once a page is chosen.
  const closeOnMobile = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border/80 px-3.5 pt-3.5 pb-3">
        <Link
          to="/"
          onClick={closeOnMobile}
          className="flex items-center gap-2.5 rounded-md ring-sidebar-ring outline-hidden focus-visible:ring-2"
        >
          {/* Squared off and graded like the About page portrait, hairline
              included, so it reads as a photo rather than an account avatar. */}
          <span className="relative block size-7 flex-none">
            <img
              src={assetUrl("photo.jpg")}
              alt=""
              className="size-7 rounded-[4px] object-cover object-[50%_12%] contrast-[1.06] grayscale dark:brightness-90"
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 -bottom-0.75 block h-px bg-brand/55"
            />
          </span>
          <span className="flex min-w-0 flex-col gap-0.75">
            <span className="text-sm leading-none font-medium tracking-[-0.01em]">
              {siteConfig.name}
            </span>
            <span className="font-mono text-[0.59375rem] leading-none tracking-[0.2em] text-muted-foreground uppercase">
              {siteConfig.domain}
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-2.5">
        <SidebarGroup className="px-2.5 py-0">
          <SidebarMenu className="gap-px">
            {primaryNav.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  className={rowClass}
                >
                  <Link to={item.url} onClick={closeOnMobile}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="px-2.5 py-0">
          <SidebarGroupLabel className="h-auto gap-2.5 px-2.5 pt-5.5 pb-2 font-mono text-[0.59375rem] leading-[0.8125rem] font-normal tracking-[0.2em] text-muted-foreground uppercase">
            Explore
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-sidebar-border/80"
            />
          </SidebarGroupLabel>
          <SidebarMenu className="gap-px">
            {sectionNav.map((section) => (
              <Collapsible
                key={section.title}
                asChild
                defaultOpen={section.items.some(
                  (item) => item.url === pathname
                )}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={rowClass}>
                      <section.icon />
                      <span>{section.title}</span>
                      <span className="ml-auto font-mono text-[0.625rem] text-muted-foreground">
                        {section.items.length}
                      </span>
                      <ChevronRight className="size-3.5! text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {/* mt-0.75 rather than the prototype's 2px: there the
                        rows' 1px gap also sat above the list. */}
                    <SidebarMenuSub className="mt-0.75 mr-0 mb-1.5 ml-5 translate-x-0 gap-0 p-0 pl-3.5">
                      {section.items.map((item) => (
                        <SidebarMenuSubItem key={item.url}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === item.url}
                            className={cn(
                              "h-7.5 translate-x-0 rounded-sm px-2.5 text-muted-foreground hover:bg-sidebar-accent/70 data-[size=md]:text-[0.8125rem]",
                              activeClass
                            )}
                          >
                            <Link to={item.url} onClick={closeOnMobile}>
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
