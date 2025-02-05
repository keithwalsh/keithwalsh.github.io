/**
 * @fileoverview Professional timeline component with expandable position details.
 */

import { useState } from "react"
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@mui/lab"
import { Box, Collapse, List, ListItem, Paper, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import professionalJourneyData from '../data/professionalJourney.json'

interface TimelinePosition {
    year: string
    title: string
    company: string
    companyDescription?: string
    companyDescription2?: string
    details: string[]
    dateRange?: string
    location?: string
}

export function ProfessionalJourney() {
    const [expandedItem, setExpandedItem] = useState<string | null>(null)
    const positions: TimelinePosition[] = professionalJourneyData.positions
    
    return (
        <>
            <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: 'bold' }}>
                Professional Journey
            </Typography>
            
            <Timeline position="alternate" sx={{ mb: 6 }}>
                    {positions.map((position, index) => (
                        <TimelineItem 
                            key={position.year}
                            onClick={() => setExpandedItem(expandedItem === position.year ? null : position.year)}
                            sx={{ 
                                cursor: 'pointer',
                                '&:hover': {
                                    '& .MuiTimelineDot-root': {
                                        transform: 'scale(1.2)',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        transform: expandedItem === position.year 
                                            ? 'rotate(180deg) scale(1.2)' 
                                            : 'scale(1.2)',
                                        color: position.year === "2024" ? 'primary.main' : 'secondary.main'
                                    }
                                }
                            }}
                        >
                            <TimelineOppositeContent sx={{ m: "auto 0" }} align="right" variant="body2" color="text.secondary">
                                <Typography>{position.year}</Typography>
                                <Collapse in={expandedItem === position.year}>
                                    <Typography variant="body1" display="block" color="text.primary" sx={{ fontSize: "1.1rem" }}>
                                        {position.dateRange}
                                    </Typography>
                                    <Typography variant="body1" display="block" color="text.secondary">
                                        {position.location}
                                    </Typography>
                                </Collapse>
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot 
                                    color={position.year === "2024" ? "primary" : "secondary"}
                                    sx={{ transition: 'transform 0.2s' }}
                                />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
                                    textAlign: index % 2 === 0 ? 'left' : 'right'
                                }}>
                                    <Box sx={{ 
                                        textAlign: 'inherit',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        flexDirection: index % 2 === 0 ? 'row' : 'row-reverse'
                                    }}>
                                        <Box>
                                            <Typography variant="h6">{position.title}</Typography>
                                            <Typography color="text.secondary">{position.company}</Typography>
                                        </Box>
                                        <ExpandMoreIcon 
                                            sx={{ 
                                                transform: expandedItem === position.year ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.2s ease',
                                                opacity: 0.6
                                            }} 
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end'
                                }}>
                                    <Collapse in={expandedItem === position.year}>
                                        <Paper 
                                            elevation={1}
                                            sx={{ 
                                                mt: 2, 
                                                p: 2,
                                                bgcolor: 'background.default',
                                                maxWidth: 'fit-content'
                                            }}
                                        >
                                            <List dense disablePadding>
                                                {position.companyDescription && (
                                                    <ListItem sx={{ p: 0, mb: 1 }}>
                                                        <Typography 
                                                            variant="caption" 
                                                            color="text.secondary"
                                                            sx={{ 
                                                                fontWeight: 500
                                                            }}
                                                        >
                                                            {position.companyDescription}
                                                        </Typography>
                                                    </ListItem>
                                                )}
                                                {position.companyDescription2 && (
                                                    <ListItem sx={{ p: 0, mb: 1, mt: -1 }}>
                                                        <Typography 
                                                            variant="caption" 
                                                            color="text.secondary"
                                                            sx={{ 
                                                                fontWeight: 500
                                                            }}
                                                        >
                                                            {position.companyDescription2}
                                                        </Typography>
                                                    </ListItem>
                                                )}
                                                <List 
                                                    dense 
                                                    component="ul" 
                                                    sx={{ 
                                                        listStyleType: 'disc',
                                                        pl: 2 // Add left padding for bullets
                                                    }}
                                                >
                                                    {position.details.map((detail, index) => (
                                                        <ListItem 
                                                            key={index}
                                                            sx={{ 
                                                                p: 0,
                                                                display: 'list-item' // This enables the bullet points
                                                            }}
                                                        >
                                                            <Typography variant="caption" color="text.secondary">
                                                                {detail}
                                                            </Typography>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </List>
                                        </Paper>
                                    </Collapse>
                                </Box>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
        </>
    )
}
