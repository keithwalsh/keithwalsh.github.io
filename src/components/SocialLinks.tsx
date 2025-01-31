/**
 * @fileoverview Social media link buttons with consistent styling and animations
 */

import { Box, Typography, Stack } from "@mui/material"
import { GitHub, LinkedIn } from "@mui/icons-material"
import { FaStackOverflow } from "react-icons/fa"
import socialLinksData from "../data/socialLinks.json"

interface SocialLink {
    href: string
    iconKey: string
    label: string
    bgColor: string
    hoverColor: string
}

interface SocialLinkProps extends Omit<SocialLink, 'iconKey'> {
    icon: React.ReactNode
}

const iconMap: Record<string, React.ReactNode> = {
    github: <GitHub sx={{ fontSize: 20 }} />,
    stackoverflow: <FaStackOverflow style={{ fontSize: 20 }} />,
    linkedin: <LinkedIn sx={{ fontSize: 20 }} />
}

function SocialLink({ href, icon, label, bgColor, hoverColor }: SocialLinkProps) {
    return (
        <Box
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${label}`}
            sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: bgColor,
                color: 'white',
                borderRadius: 2,
                boxShadow: 2,
                textDecoration: 'none',
                overflow: 'hidden',
                width: 200,
                '&:hover': {
                    bgcolor: hoverColor,
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                    transition: 'all 0.2s ease-in-out'
                }
            }}
        >
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1.5,
                bgcolor: 'rgba(0, 0, 0, 0.1)'
            }}>
                {icon}
            </Box>
            <Box sx={{ flex: 1, pl: 1.5 }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        letterSpacing: 0.5
                    }}
                >
                    {label}
                </Typography>
            </Box>
        </Box>
    )
}

export function SocialLinks() {
    return (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ width: '100%' }}
        >
            {(socialLinksData.links as SocialLink[]).map(link => (
                <SocialLink 
                    key={link.label} 
                    {...link} 
                    icon={iconMap[link.iconKey]} 
                />
            ))}
        </Stack>
    )
} 