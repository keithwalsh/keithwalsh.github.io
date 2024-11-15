import React from "react"
import { Home, ContactMail, Build, Work, Code, Analytics } from "@mui/icons-material"

export interface NavigationSubItem {
    path: string
    label: string
    icon: React.ReactElement
}

export interface NavigationItem {
    path: string
    label: string
    icon: React.ReactElement
    showDividerBelow?: boolean
    subItems?: NavigationSubItem[]
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
    { path: "/", label: "About", icon: <Home /> },
    { path: "/contact", label: "Contact", icon: <ContactMail />, showDividerBelow: true },
    { 
        path: "/tools", 
        label: "Tools", 
        icon: <Build />,
        subItems: [
            { path: "/tools/development", label: "Development", icon: <Code /> },
            { path: "/tools/analytics", label: "Analytics", icon: <Analytics /> }
        ]
    },
    { path: "/projects", label: "Projects", icon: <Work /> },
]
