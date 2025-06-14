import React, { useState } from 'react'
import { Box, List, Divider, ListItemIcon, Collapse } from '@mui/material'
import {
  StyledListItem,
  StyledListItemText,
  NavigationListItemButton,
} from './StyledComponents'
import {
  NAVIGATION_ITEMS,
  NavigationItem,
  NavigationSubItem,
} from './NavigationItems'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { ExpandMore, ExpandLess } from '@mui/icons-material'

interface DrawerContentProps {
  isDesktop: boolean
  setOpen: (open: boolean) => void
}

type NavigationButtonProps = {
  isSubItem?: boolean
  path?: string
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}

function NavigationButton({
  isSubItem,
  path,
  selected,
  onClick,
  children,
}: NavigationButtonProps) {
  const ButtonComponent = NavigationListItemButton as any

  return (
    <ButtonComponent
      component={path ? RouterLink : 'div'}
      {...(path && { to: path })}
      selected={selected}
      onClick={onClick}
      sx={{
        pl: isSubItem ? 4 : 1.4,
        height: 48,
      }}
    >
      {children}
    </ButtonComponent>
  )
}

export function DrawerContent({ isDesktop, setOpen }: DrawerContentProps) {
  const location = useLocation()
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const handleItemClick = (path: string, hasSubItems: boolean) => {
    if (hasSubItems) {
      setExpandedItem(expandedItem === path ? null : path)
    } else if (!isDesktop) {
      setOpen(false)
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <List sx={{ padding: 0 }}>
        {NAVIGATION_ITEMS.map((item: NavigationItem) => {
          const { path, label, icon, showDividerBelow, subItems } = item
          const isSelected =
            !subItems &&
            (path === '/'
              ? location.pathname === '/'
              : location.pathname === path)
          const isExpanded = expandedItem === path

          return (
            <React.Fragment key={path}>
              <StyledListItem disablePadding>
                <NavigationButton
                  isSubItem={false}
                  path={subItems ? undefined : path}
                  selected={isSelected}
                  onClick={() => handleItemClick(path, !!subItems)}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
                  <StyledListItemText primary={label} />
                  {subItems && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
                </NavigationButton>
              </StyledListItem>

              {subItems && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {subItems.map((subItem: NavigationSubItem) => (
                      <StyledListItem key={subItem.path} disablePadding>
                        <NavigationButton
                          isSubItem={true}
                          path={subItem.path}
                          selected={location.pathname === subItem.path}
                          onClick={() => !isDesktop && setOpen(false)}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {subItem.icon}
                          </ListItemIcon>
                          <StyledListItemText primary={subItem.label} />
                        </NavigationButton>
                      </StyledListItem>
                    ))}
                  </List>
                </Collapse>
              )}

              {showDividerBelow && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          )
        })}
      </List>
    </Box>
  )
}
