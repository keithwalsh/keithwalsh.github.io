import React from "react"
import { RocketLaunch, Home, ContactMail, Work, Coffee, BarChart } from "@mui/icons-material"
/* Temporarily disabled until implementation is complete
import { Build, DataObject } from "@mui/icons-material"
import { IoLogoMarkdown } from "react-icons/io5"
*/

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
    { path: "/visualizations", label: "Visualizations", icon: <BarChart /> },
    /* Temporarily disabled until implementation is complete
    { 
        path: "/tools", 
        label: "Tools", 
        icon: <Build />,
        subItems: [
            { path: "/tools/json-explorer", label: "JSON Explorer", icon: <DataObject /> },
            { 
                path: "/tools/markdown-table", 
                label: "Markdown Table", 
                icon: <IoLogoMarkdown style={{ 
                    fontSize: "1.25rem",
                    position: "relative",
                    left: "2px",
                    top: "-1px",
                }} />
            }
        ]
    },
    */
    { 
        path: "/projects", 
        label: "Projects", 
        icon: <RocketLaunch />,
        subItems: [
            { path: "/projects/professional", label: "Professional", icon: <Work /> },
            { path: "/projects/personal", label: "Personal", icon: <Coffee /> }
        ]
    },
]
