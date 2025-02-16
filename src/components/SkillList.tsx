/**
 * @fileoverview Skills grid displaying technical proficiencies with progress bars.
 */

import { Box, Grid, Paper, Typography } from '@mui/material'
import { FaPython, FaDatabase } from 'react-icons/fa'
import {
  SiTypescript,
  SiPhp,
  SiJavascript,
  SiNodedotjs,
  SiHtml5,
  SiReact,
  SiCss3,
} from 'react-icons/si'
import skillsData from '../data/skills.json'

interface Skill {
  name: string
  level: number
  category: string
  iconKey: string
  color: string
}

const iconMap: Record<string, React.ReactNode> = {
  python: <FaPython />,
  database: <FaDatabase />,
  javascript: <SiJavascript />,
  typescript: <SiTypescript />,
  php: <SiPhp />,
  html: <SiHtml5 />,
  css: <SiCss3 />,
  react: <SiReact />,
  node: <SiNodedotjs />,
}

export function SkillList() {
  return (
    <>
      <Typography variant="h5" sx={{ mt: 6, mb: 4, fontWeight: 'bold' }}>
        Skills & Expertise
      </Typography>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {(skillsData.skills as Skill[]).map(skill => (
            <Grid key={skill.name} item xs={12} sm={6} md={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: '160px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme =>
                      `0 8px 24px ${theme.palette.action.hover}`,
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
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
                      opacity: 0.9,
                    }}
                  >
                    {iconMap[skill.iconKey]}
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 0.5,
                        fontWeight: 'medium',
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
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${skill.level}%`,
                      bgcolor: skill.color,
                      transition: 'width 1.5s ease-in-out',
                      opacity: 0.8,
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  )
}
