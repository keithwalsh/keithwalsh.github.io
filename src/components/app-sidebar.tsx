import { Link, useLocation } from "react-router"
import { ChevronRight } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/" onClick={closeOnMobile}>
                <Avatar>
                  <AvatarImage src={assetUrl("photo.jpg")} alt="" />
                  <AvatarFallback>KW</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-medium">
                    {siteConfig.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {siteConfig.domain}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {primaryNav.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild isActive={pathname === item.url}>
                  <Link to={item.url} onClick={closeOnMobile}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Explore</SidebarGroupLabel>
          <SidebarMenu>
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
                    <SidebarMenuButton>
                      <section.icon />
                      <span>{section.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {section.items.map((item) => (
                        <SidebarMenuSubItem key={item.url}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === item.url}
                          >
                            <Link to={item.url} onClick={closeOnMobile}>
                              <item.icon />
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
