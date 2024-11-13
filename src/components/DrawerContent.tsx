import React from "react"
import { Box, List, Divider, ListItemIcon } from "@mui/material"
import { StyledListItem, StyledListItemText, NavigationListItemButton } from "./StyledComponents"
import { NAVIGATION_ITEMS } from "./NavigationItems"
import { useMatch, Link as RouterLink } from "react-router-dom"

interface DrawerContentProps {
    isDesktop: boolean
    setOpen: (open: boolean) => void
}

export function DrawerContent({ isDesktop, setOpen }: DrawerContentProps) {
    return (
        <Box sx={{ p: 2 }}>
            <List sx={{ padding: 0 }}>
                {NAVIGATION_ITEMS.map(({ path, label, icon, showDividerBelow }) => {
                    const match = useMatch({ path, end: true })
                    return (
                        <React.Fragment key={path}>
                            <StyledListItem disablePadding>
                                <NavigationListItemButton
                                    component={RouterLink}
                                    to={path}
                                    selected={Boolean(match)}
                                    onClick={() => !isDesktop && setOpen(false)}
                                    sx={{
                                        px: 1.4,
                                        height: 48,
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
                                    <StyledListItemText primary={label} />
                                </NavigationListItemButton>
                            </StyledListItem>
                            {showDividerBelow && <Divider sx={{ my: 1 }} />}
                        </React.Fragment>
                    )
                })}
            </List>
        </Box>
    )
}
