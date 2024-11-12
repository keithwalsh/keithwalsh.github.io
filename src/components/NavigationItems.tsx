import React from "react"
import { Home, ContactMail, Build, Work } from "@mui/icons-material"

export interface NavigationItem {
    path: string
    label: string
    icon: React.ReactElement
    showDividerBelow?: boolean
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
    { path: "/", label: "About", icon: <Home /> },
    { path: "/contact", label: "Contact", icon: <ContactMail />, showDividerBelow: true },
    { path: "/tools", label: "Tools", icon: <Build /> },
    { path: "/projects", label: "Projects", icon: <Work /> },
]
