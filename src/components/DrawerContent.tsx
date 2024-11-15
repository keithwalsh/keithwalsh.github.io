import React, { useState } from "react"
import { Box, List, Divider, ListItemIcon, Collapse } from "@mui/material"
import { StyledListItem, StyledListItemText, NavigationListItemButton } from "./StyledComponents"
import { NAVIGATION_ITEMS } from "./NavigationItems"
import { Link as RouterLink, useLocation } from "react-router-dom"
import { ExpandMore, ExpandLess } from "@mui/icons-material"

interface DrawerContentProps {
    isDesktop: boolean
    setOpen: (open: boolean) => void
}

export function DrawerContent({ isDesktop, setOpen }: DrawerContentProps) {
    const location = useLocation();
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const handleItemClick = (path: string, hasSubItems: boolean) => {
        if (hasSubItems) {
            setExpandedItem(expandedItem === path ? null : path);
        } else if (!isDesktop) {
            setOpen(false);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <List sx={{ padding: 0 }}>
                {NAVIGATION_ITEMS.map(({ path, label, icon, showDividerBelow, subItems }) => {
                    const isSelected = !subItems && (path === "/" 
                        ? location.pathname === "/" 
                        : location.pathname === path);
                    
                    const isExpanded = expandedItem === path;

                    return (
                        <React.Fragment key={path}>
                            <StyledListItem disablePadding>
                                <NavigationListItemButton
                                    component={subItems ? 'div' : RouterLink}
                                    to={subItems ? '#' : path}
                                    selected={isSelected}
                                    onClick={() => handleItemClick(path, !!subItems)}
                                    sx={{
                                        px: 1.4,
                                        height: 48,
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
                                    <StyledListItemText primary={label} />
                                    {subItems && (
                                        isExpanded ? <ExpandLess /> : <ExpandMore />
                                    )}
                                </NavigationListItemButton>
                            </StyledListItem>
                            
                            {subItems && (
                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {subItems.map((subItem) => (
                                            <StyledListItem key={subItem.path} disablePadding>
                                                <NavigationListItemButton
                                                    component={RouterLink}
                                                    to={subItem.path}
                                                    selected={location.pathname === subItem.path}
                                                    onClick={() => !isDesktop && setOpen(false)}
                                                    sx={{
                                                        pl: 4,
                                                        height: 40,
                                                    }}
                                                >
                                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                                        {subItem.icon}
                                                    </ListItemIcon>
                                                    <StyledListItemText primary={subItem.label} />
                                                </NavigationListItemButton>
                                            </StyledListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                            
                            {showDividerBelow && <Divider sx={{ my: 1 }} />}
                        </React.Fragment>
                    );
                })}
            </List>
        </Box>
    );
}
