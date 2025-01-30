/**
 * @fileoverview About page component containing professional timeline and information.
 */

import { Box, Container, Typography, Paper, Grid } from "@mui/material"
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "@mui/lab"
import { FaPython, FaDatabase, FaChartBar } from "react-icons/fa"
import { SiPowerbi, SiSnowflake, SiGooglebigquery } from "react-icons/si"

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
            name: "Python", 
            level: 90, 
            category: "Data Analytics",
            icon: <FaPython />,
            color: "#3776AB"
        },
        { 
            name: "SQL", 
            level: 90, 
            category: "Database",
            icon: <FaDatabase />,
            color: "#336791"
        },
        { 
            name: "Tableau", 
            level: 85, 
            category: "Visualization",
            icon: <FaChartBar />,
            color: "#E97627"
        },
        { 
            name: "Power BI", 
            level: 85, 
            category: "Visualization",
            icon: <SiPowerbi />,
            color: "#F2C811"
        },
        { 
            name: "Snowflake", 
            level: 80, 
            category: "Data Warehouse",
            icon: <SiSnowflake />,
            color: "#29B5E8"
        },
        { 
            name: "BigQuery", 
            level: 80, 
            category: "Data Warehouse",
            icon: <SiGooglebigquery />,
            color: "#4285F4"
        }
    ]

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 8 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    About Me
                </Typography>
                
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        mb: 6,
                        position: 'relative'
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            width: 200,
                            height: 200,
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: -4,
                                left: -4,
                                right: -4,
                                bottom: -4,
                                background: 'linear-gradient(45deg, primary.main, secondary.main)',
                                borderRadius: '50%',
                                animation: 'spin 10s linear infinite',
                                opacity: 0.7
                            },
                            '@keyframes spin': {
                                '0%': {
                                    transform: 'rotate(0deg)',
                                },
                                '100%': {
                                    transform: 'rotate(360deg)',
                                }
                            }
                        }}
                    >
                        <Box
                            component="img"
                            src="/photo.jpg"
                            alt="Profile photo"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                position: 'relative',
                                zIndex: 1,
                                border: '4px solid white',
                                boxShadow: theme => `0 8px 32px ${theme.palette.primary.main}25`
                            }}
                        />
                    </Box>
                    <Box 
                        sx={{ 
                            flex: 1,
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: -20,
                                top: 0,
                                bottom: 0,
                                width: 4,
                                background: 'linear-gradient(to bottom, transparent, primary.main, transparent)',
                                opacity: 0.3
                            }
                        }}
                    >
                        <Typography 
                            variant="body1" 
                            paragraph 
                            sx={{ 
                                fontSize: '1.1rem', 
                                maxWidth: '800px',
                                position: 'relative',
                                pl: 2,
                                pr: 1,
                                '&::before': {
                                    content: 'open-quote',
                                    fontSize: '4rem',
                                    color: 'primary.main',
                                    opacity: 0.2,
                                    position: 'absolute',
                                    top: -20,
                                    left: -20
                                },
                                '&::after': {
                                    content: 'close-quote',
                                    fontSize: '4rem',
                                    color: 'primary.main',
                                    opacity: 0.2,
                                    position: 'absolute',
                                    bottom: -50,
                                    right: -20
                                }
                            }}
                        >
                            Data Analyst with 15+ years of experience delivering actionable insights, automating data workflows, 
                            and developing advanced data solutions. Skilled at transforming complex datasets into intuitive 
                            dashboards and analytical reports that drive strategic decisions. Adept at collaborating across 
                            departments, bridging technical and non-technical perspectives, and optimising operations through 
                            Python, SQL, and leading analytics tools.
                        </Typography>
                    </Box>
                </Box>
                
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
                            <Typography variant="h6">Data Analyst</Typography>
                            <Typography>Mar. 2024 - Present</Typography>
                            <Typography variant="body2">Pitney Bowes, Dublin</Typography>
                            <Typography variant="body2">Developing data solutions and analytics tools for invoice processing and client engagement</Typography>
                        </TimelineContent>
                    </TimelineItem>

                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color="secondary" />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="h6">Client Support Manager</Typography>
                            <Typography>Nov. 2019 - Feb. 2021</Typography>
                            <Typography variant="body2">Pitney Bowes, Dublin</Typography>
                            <Typography variant="body2">Led a team of 13 agents and developed automated KPI reporting systems</Typography>
                        </TimelineContent>
                    </TimelineItem>

                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color="primary" />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="h6">Client Support Business Analyst</Typography>
                            <Typography>Jun. 2018 - Oct. 2019</Typography>
                            <Typography variant="body2">Pitney Bowes, Dublin</Typography>
                            <Typography variant="body2">Created automation tools and performance tracking systems</Typography>
                        </TimelineContent>
                    </TimelineItem>

                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="h6">Payments & Risk Management Analyst</Typography>
                            <Typography>Apr. 2015 - Jun. 2018</Typography>
                            <Typography variant="body2">BetBright / 888, Dublin</Typography>
                            <Typography variant="body2">Led risk assessment and fraud prevention initiatives</Typography>
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
                    >
                        {skills.map((skill) => (
                            <Grid key={skill.name} item xs={12} sm={6} md={4}>
                                <Paper 
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
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Typography variant="h5" sx={{ mt: 6, mb: 4, fontWeight: 'bold' }}>
                    Education & Certifications
                </Typography>

                <Box sx={{ mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid container xs={12} md={6}>
                            <Paper 
                                elevation={2}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: (theme) => `0 8px 24px ${theme.palette.action.hover}`,
                                    }
                                }}
                            >
                                <Typography variant="h6" gutterBottom>Education</Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                        B.Sc. Engineering with Management
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Trinity College Dublin, 2010
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid container xs={12} md={6}>
                            <Paper 
                                elevation={2}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: (theme) => `0 8px 24px ${theme.palette.action.hover}`,
                                    }
                                }}
                            >
                                <Typography variant="h6" gutterBottom>Recent Certifications</Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                        GCP Associate Cloud Engineer
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Google, 2025
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                        Google Data Analytics Professional Certificate
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Google, 2025
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                        GitHub Foundations Certification
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        GitHub, 2025
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}
