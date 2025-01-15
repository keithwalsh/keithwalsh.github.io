/**
 * @fileoverview Accessibility menu component providing font size controls, high
 * contrast mode, and screen reader optimization settings. Settings persist in
 * localStorage.
 */

import { Menu, MenuItem, ListItemIcon, Divider, Paper, ListItemText } from "@mui/material";
import { TextIncrease, TextDecrease, Cached } from "@mui/icons-material";
import { useState, useEffect } from "react";

/** Props for the AccessibilityMenu component */
interface AccessibilityMenuProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
}

/** User accessibility preferences for font size, contrast and screen reader settings */
interface AccessibilitySettings {
    fontSize: number;
    highContrast: boolean;
    screenReader: boolean;
}

/** Font size constraints and increment value for accessibility settings */
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;
const FONT_SIZE_STEP = 1;
const DEFAULT_FONT_SIZE = 16;

export function AccessibilityMenu({ anchorEl, open, onClose }: AccessibilityMenuProps) {
    const [settings, setSettings] = useState<AccessibilitySettings>(() => {
        const savedSettings = localStorage.getItem("accessibilitySettings");
        return savedSettings
            ? JSON.parse(savedSettings)
            : {
                  fontSize: DEFAULT_FONT_SIZE,
                  highContrast: false,
                  screenReader: false,
              };
    });

    useEffect(() => {
        // Apply font size to root element
        document.documentElement.style.fontSize = `${settings.fontSize}px`;

        // Apply high contrast theme
        document.documentElement.classList.toggle("high-contrast", settings.highContrast);

        // Save settings to localStorage
        localStorage.setItem("accessibilitySettings", JSON.stringify(settings));
    }, [settings]);

    const handleFontSizeChange = (increase: boolean) => {
        setSettings((prev) => ({
            ...prev,
            fontSize: Math.min(Math.max(prev.fontSize + (increase ? FONT_SIZE_STEP : -FONT_SIZE_STEP), MIN_FONT_SIZE), MAX_FONT_SIZE),
        }));
    };
{/* Temporarily disabled until implementation is complete
    const handleToggleSetting = (setting: keyof Omit<AccessibilitySettings, "fontSize">) => {
        setSettings((prev) => ({
            ...prev,
            [setting]: !prev[setting],
        }));
    };
*/}

    return (
        <Menu
            anchorEl={anchorEl}
            id="accessibility-menu"
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    component: Paper,
                    elevation: 3,
                },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            aria-label="Accessibility settings menu"
        >
            <MenuItem
                sx={{
                    py: 1,
                    px: 2,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    "&:hover": {
                        backgroundColor: "transparent",
                        cursor: "default",
                    },
                }}
                disableRipple
            >
                <ListItemText secondary="Accessibility Settings" />
            </MenuItem>
            <MenuItem onClick={() => handleFontSizeChange(true)} disabled={settings.fontSize >= MAX_FONT_SIZE} aria-label="Increase font size">
                <ListItemIcon>
                    <TextIncrease fontSize="small" />
                </ListItemIcon>
                Increase Font Size
            </MenuItem>

            <MenuItem onClick={() => handleFontSizeChange(false)} disabled={settings.fontSize <= MIN_FONT_SIZE} aria-label="Decrease font size">
                <ListItemIcon>
                    <TextDecrease fontSize="small" />
                </ListItemIcon>
                Decrease Font Size
            </MenuItem>

            <MenuItem
                onClick={() => setSettings((prev) => ({ ...prev, fontSize: DEFAULT_FONT_SIZE }))}
                disabled={settings.fontSize === DEFAULT_FONT_SIZE}
                aria-label="Reset font size"
            >
                <ListItemIcon>
                    <Cached fontSize="small" />
                </ListItemIcon>
                Reset Font Size
            </MenuItem>

            <Divider />
            {/* Temporarily disabled until implementation is complete
            <MenuItem onClick={() => handleToggleSetting("highContrast")} aria-label="Toggle high contrast mode">
                <ListItemIcon>
                    <Contrast fontSize="small" />
                </ListItemIcon>
                High Contrast
            </MenuItem>
            <MenuItem onClick={() => handleToggleSetting("screenReader")} aria-label="Toggle screen reader optimization">
                <ListItemIcon>
                    <Accessible fontSize="small" />
                </ListItemIcon>
                Screen Reader
            </MenuItem>
            */}
        </Menu>
    );
}