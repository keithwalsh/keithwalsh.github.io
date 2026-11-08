import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router"
import { ChevronRight } from "lucide-react"

import { eyebrowClass } from "@/components/editorial"
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
import { findNavLocation, primaryNav, sectionNav } from "@/config/navigation"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { siteConfig } from "@/config/site"
import { assetUrl } from "@/lib/browser"
import { cn } from "@/lib/utils"

// The current page gets a soft accent tint instead of the primitive's solid
// fill, and keeps it under hover.
const activeClass =
  "data-active:bg-brand-soft data-active:font-medium data-active:text-brand data-active:hover:bg-brand-soft data-active:hover:text-brand"

// The site's 3px focus ring; the sidebar primitives default to 2px.
const focusClass = "focus-visible:ring-3 focus-visible:ring-ring/50"

// Primary pages and the Explore section parents share one row shape.
const rowClass = cn(
  "h-8.5 gap-2.5 px-2.5 text-sidebar-foreground/82",
  activeClass,
  focusClass
)

export function AppSidebar() {
  const { pathname } = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()
  // The breadcrumb's own lookup, so nested routes such as /blog/:slug
  // highlight their parent entry.
  const current = findNavLocation(pathname)

  // The mobile sidebar is a sheet, so close it once a page is chosen.
  const closeOnMobile = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar>
      {/* Same height as the app header, so the bottom borders meet. */}
      <SidebarHeader className="h-14 shrink-0 border-b border-sidebar-border/80 px-3.5 pt-3.5 pb-3">
        <Link
          to="/"
          onClick={closeOnMobile}
          className={cn(
            "flex items-center gap-2.5 rounded-md outline-hidden",
            focusClass
          )}
        >
          {/* Squared off and graded like the About page portrait, hairline
              included, so it reads as a photo rather than an account avatar. */}
          <span className="relative block size-7 flex-none">
            <img
              src={assetUrl("photo.jpg")}
              alt=""
              className="size-7 rounded-xs object-cover object-[50%_12%] contrast-[1.06] grayscale dark:brightness-90"
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 -bottom-0.75 block h-px bg-brand/55"
            />
          </span>
          <span className="flex min-w-0 flex-col gap-0.75">
            <span className="text-sm leading-none font-medium">
              {siteConfig.name}
            </span>
            <span className={cn(eyebrowClass, "leading-none")}>
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
                  isActive={current?.item === item}
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
          <SidebarGroupLabel
            className={cn(
              eyebrowClass,
              "h-auto gap-2.5 px-2.5 pt-5.5 pb-2 leading-[0.8125rem] font-normal"
            )}
          >
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
                defaultOpen={current?.section === section}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={rowClass}>
                      <section.icon />
                      <span>{section.title}</span>
                      <span className="ml-auto font-mono text-meta text-muted-foreground">
                        {section.items.length}
                      </span>
                      <ChevronRight className="size-3.5! text-muted-foreground transition-transform duration-300 ease-glide group-data-[state=open]/collapsible:rotate-90 motion-reduce:transition-none" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {/* overflow-hidden also keeps the list's margins inside the
                      measured height, so the animation ends without a jump. */}
                  <CollapsibleContent className="overflow-hidden duration-300 ease-glide data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down motion-reduce:animate-none">
                    {/* mt-0.75 rather than the prototype's 2px: there the
                        rows' 1px gap also sat above the list. */}
                    <SidebarMenuSub className="mt-0.75 mr-0 mb-1.5 ml-5 translate-x-0 gap-0 p-0 pl-3.5">
                      {section.items.map((item) => (
                        <SidebarMenuSubItem key={item.url}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={current?.item === item}
                            className={cn(
                              "h-7.5 translate-x-0 rounded-sm px-2.5 text-muted-foreground hover:bg-sidebar-accent/70 data-[size=md]:text-caption",
                              activeClass,
                              focusClass
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
      <SidebarRailTooltip />
    </Sidebar>
  )
}

// Matches TooltipProvider's delayDuration, since this tooltip is opened by
// hand rather than by its trigger.
const RAIL_TOOLTIP_DELAY = 1000
const RAIL_TOOLTIP_ID = "sidebar-rail-tooltip"

// The rail is a full-height strip, so a tooltip anchored to it would sit at
// mid-screen however high the pointer is. Instead the trigger is a
// zero-height marker inside the rail that follows the pointer, and the rail's
// own hover and focus open the tooltip, with the same delay as every other
// tooltip. The marker takes no pointer events, so the rail's drag and click
// are untouched.
function SidebarRailTooltip() {
  const [open, setOpen] = useState(false)
  // Pointer height within the rail; null centres the marker, for keyboard
  // focus.
  const [pointerY, setPointerY] = useState<number | null>(null)
  const timer = useRef<number | null>(null)

  const cancelOpen = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }
  const close = () => {
    cancelOpen()
    setOpen(false)
  }
  useEffect(() => cancelOpen, [])

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <SidebarRail
        aria-describedby={open ? RAIL_TOOLTIP_ID : undefined}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return
          cancelOpen()
          timer.current = window.setTimeout(() => {
            timer.current = null
            setOpen(true)
          }, RAIL_TOOLTIP_DELAY)
        }}
        onPointerMove={(event) => {
          const { top } = event.currentTarget.getBoundingClientRect()
          setPointerY(event.clientY - top)
        }}
        onPointerLeave={close}
        // A press starts a drag or a toggle; neither wants the hint over it.
        onPointerDown={close}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) {
            setPointerY(null)
            setOpen(true)
          }
        }}
        onBlur={close}
      >
        <TooltipTrigger asChild>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-0"
            style={{ top: pointerY ?? "50%" }}
          />
        </TooltipTrigger>
      </SidebarRail>
      {/* The marker moves by style alone, which the default position watcher
          misses, so re-measure every frame while open. */}
      <TooltipContent
        id={RAIL_TOOLTIP_ID}
        side="right"
        updatePositionStrategy="always"
      >
        Drag to resize, click to toggle
      </TooltipContent>
    </Tooltip>
  )
}
