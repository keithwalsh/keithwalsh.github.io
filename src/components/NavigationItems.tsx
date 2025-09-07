/**
 * @fileoverview Navigation configuration and types for sidebar and header menus, using MUI and react-icons for icons. Centralizes route paths and navigation structure.
 */

import { ReactNode } from 'react'
// import HomeIcon from '@mui/icons-material/Home'
//import ContactMailIcon from '@mui/icons-material/ContactMail'
//import BarChartIcon from '@mui/icons-material/BarChart'
//import WbSunnyIcon from '@mui/icons-material/WbSunny'
import BuildIcon from '@mui/icons-material/Build'
import DataObjectIcon from '@mui/icons-material/DataObject'
// import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
//import WorkIcon from '@mui/icons-material/Work'
//import CoffeeIcon from '@mui/icons-material/Coffee'
import { IoLogoMarkdown } from 'react-icons/io5'
import CodeIcon from '@mui/icons-material/Code'
import ScheduleIcon from '@mui/icons-material/Schedule'
import WebIcon from '@mui/icons-material/Web'

export enum ROUTES {
  ABOUT = '/',
  CONTACT = '/contact',
  VIS = '/visualizations',
  WEATHER = '/visualizations/weather',
  TOOLS = '/tools',
  JSON_EXPLORER = '/tools/json-explorer',
  MD_TABLE = '/tools/markdown-table',
  CODE_ANNOTATOR = '/tools/code-annotator',
  CRON_EXPRESSIONS = '/tools/cron-expressions',
  BROWSER_MOCKUP = '/tools/browser-mockup',
  PROJECTS = '/projects',
  PRO_PROJECTS = '/projects/professional',
  PERS_PROJECTS = '/projects/personal',
}

export interface NavigationSubItem {
  path: ROUTES
  label: string
  icon: ReactNode
}

export interface NavigationItem extends NavigationSubItem {
  showDividerBelow?: boolean
  subItems?: NavigationSubItem[]
}

export const NAVIGATION_ITEMS = [
  // { path: ROUTES.ABOUT, label: 'About', icon: <HomeIcon /> },
  // {
  //   path: ROUTES.CONTACT,
  //   label: 'Contact',
  //   icon: <ContactMailIcon />,
  //   showDividerBelow: true,
  // },
  // {
  //   path: ROUTES.VIS,
  //   label: 'Visualizations',
  //   icon: <BarChartIcon />,
  //   subItems: [
  //     { path: ROUTES.WEATHER, label: 'Weather', icon: <WbSunnyIcon /> },
  //   ],
  // },
  {
    path: ROUTES.TOOLS,
    label: 'Tools',
    icon: <BuildIcon />,
    subItems: [
      {
        path: ROUTES.BROWSER_MOCKUP,
        label: 'Browser Mockup',
        icon: <WebIcon />,
      },
      {
        path: ROUTES.CODE_ANNOTATOR,
        label: 'Code Annotator',
        icon: <CodeIcon />,
      },
      {
        path: ROUTES.CRON_EXPRESSIONS,
        label: 'Cron Expressions',
        icon: <ScheduleIcon />,
      },
      {
        path: ROUTES.JSON_EXPLORER,
        label: 'JSON Explorer',
        icon: <DataObjectIcon />,
      },
      {
        path: ROUTES.MD_TABLE,
        label: 'Markdown Table',
        icon: <IoLogoMarkdown style={{ fontSize: '1.25rem' }} />,
      },
    ],
  },
  // {
  //   path: ROUTES.PROJECTS,
  //   label: 'Projects',
  //   icon: <RocketLaunchIcon />,
  //   subItems: [
  //     {
  //       path: ROUTES.PRO_PROJECTS,
  //       label: 'Professional',
  //       icon: <WorkIcon />,
  //     },
  //     { path: ROUTES.PERS_PROJECTS, label: 'Personal', icon: <CoffeeIcon /> },
  //   ],
  // },
] as const satisfies ReadonlyArray<NavigationItem>
