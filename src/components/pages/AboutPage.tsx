/**
 * @fileoverview About page component containing professional timeline and information.
 */

import { Box, Container, Typography, Paper } from "@mui/material"
import Grid from "@mui/material/Grid2"
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "@mui/lab"
import { FaReact, FaNodeJs, FaAws, FaDocker } from "react-icons/fa"
import { SiTypescript, SiGraphql } from "react-icons/si"

interface Skill {
    name: string
    level: number
    category: string
    icon: React.ReactNode
    color: string
}

export function AboutPage() {
    const skills: Skill[] = [
        { 
            name: "React", 
            level: 90, 
            category: "Frontend",
            icon: <FaReact />,
            color: "#61DAFB"
        },
        { 
            name: "TypeScript", 
            level: 85, 
            category: "Languages",
            icon: <SiTypescript />,
            color: "#3178C6"
        },
        { 
            name: "Node.js", 
            level: 80, 
            category: "Backend",
            icon: <FaNodeJs />,
            color: "#339933"
        },
        { 
            name: "AWS", 
            level: 75, 
            category: "Cloud",
            icon: <FaAws />,
            color: "#FF9900"
        },
        { 
            name: "Docker", 
            level: 70, 
            category: "DevOps",
            icon: <FaDocker />,
            color: "#2496ED"
        },
        { 
            name: "GraphQL", 
            level: 85, 
            category: "API",
            icon: <SiGraphql />,
            color: "#E535AB"
        }
    ]

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 8 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    About Me
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', maxWidth: '800px' }}>
                    I'm a software developer passionate about creating elegant solutions to complex problems.
                </Typography>
                
                <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: 'bold' }}>
                    Professional Journey
                </Typography>
                
                <Timeline position="alternate" sx={{ mb: 6 }}>
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color="primary" />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="h6">Senior Developer</Typography>
                            <Typography>2022 - Present</Typography>
                            <Typography variant="body2">Leading development of enterprise applications</Typography>
                        </TimelineContent>
                    </TimelineItem>

                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color="secondary" />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="h6">Full Stack Developer</Typography>
                            <Typography>2019 - 2022</Typography>
                            <Typography variant="body2">Built scalable web applications using React and Node.js</Typography>
                        </TimelineContent>
                    </TimelineItem>

                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="h6">Junior Developer</Typography>
                            <Typography>2017 - 2019</Typography>
                            <Typography variant="body2">Started career with front-end development</Typography>
                        </TimelineContent>
                    </TimelineItem>
                </Timeline>
                
                <Typography variant="h5" sx={{ mt: 6, mb: 4, fontWeight: 'bold' }}>
                    Skills & Expertise
                </Typography>
                
                <Box sx={{ flexGrow: 1 }}>
                    <Grid 
                        container 
                        spacing={3} 
                        sx={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',  // Forces 3 columns
                            gap: 3
                        }}
                    >
                        {skills.map((skill) => (
                            <Paper 
                                key={skill.name}
                                elevation={2}
                                sx={{
                                    p: 3,
                                    height: '160px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: (theme) => `0 8px 24px ${theme.palette.action.hover}`,
                                    },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box 
                                        sx={{ 
                                            fontSize: '2.5rem', 
                                            mr: 2,
                                            color: skill.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            opacity: 0.9
                                        }}
                                    >
                                        {skill.icon}
                                    </Box>
                                    <Box>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                mb: 0.5,
                                                fontWeight: 'medium'
                                            }}
                                        >
                                            {skill.name}
                                        </Typography>
                                        <Typography 
                                            variant="caption" 
                                            color="text.secondary"
                                            sx={{ fontSize: '0.875rem' }}
                                        >
                                            {skill.category}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        height: 8,
                                        width: '100%',
                                        bgcolor: 'grey.100',
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: '100%',
                                            width: `${skill.level}%`,
                                            bgcolor: skill.color,
                                            transition: 'width 1.5s ease-in-out',
                                            opacity: 0.8,
                                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                </Box>
                            </Paper>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}
