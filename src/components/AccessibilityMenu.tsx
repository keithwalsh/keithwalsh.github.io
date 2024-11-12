import { Menu, MenuItem, ListItemIcon, Divider, Paper } from "@mui/material"
import TextIncreaseIcon from "@mui/icons-material/TextIncrease"
import TextDecreaseIcon from "@mui/icons-material/TextDecrease"
import ContrastIcon from "@mui/icons-material/Contrast"
import AccessibleIcon from "@mui/icons-material/Accessible"

interface AccessibilityMenuProps {
    anchorEl: null | HTMLElement
    isAccessibilityMenuOpen: boolean
    handleAccessibilityClose: () => void
}

export function AccessibilityMenu({ anchorEl, isAccessibilityMenuOpen, handleAccessibilityClose }: AccessibilityMenuProps) {
    return (
        <Menu
            anchorEl={anchorEl}
            id="accessibility-menu"
            open={isAccessibilityMenuOpen}
            onClose={handleAccessibilityClose}
            onClick={handleAccessibilityClose}
            PaperProps={{
                component: Paper,
                elevation: 3,
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
            <MenuItem onClick={handleAccessibilityClose}>
                <ListItemIcon>
                    <TextIncreaseIcon fontSize="small" />
                </ListItemIcon>
                Increase Font Size
            </MenuItem>
            <MenuItem onClick={handleAccessibilityClose}>
                <ListItemIcon>
                    <TextDecreaseIcon fontSize="small" />
                </ListItemIcon>
                Decrease Font Size
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleAccessibilityClose}>
                <ListItemIcon>
                    <ContrastIcon fontSize="small" />
                </ListItemIcon>
                High Contrast
            </MenuItem>
            <MenuItem onClick={handleAccessibilityClose}>
                <ListItemIcon>
                    <AccessibleIcon fontSize="small" />
                </ListItemIcon>
                Screen Reader
            </MenuItem>
        </Menu>
    )
}
