import React from 'react'
import {
  Typography,
  Container,
  Paper,
  Box,
  Chip,
  Tooltip,
  IconButton,
  Grid,
} from '@mui/material'
import { GitHub, OpenInNew, Star, Coffee } from '@mui/icons-material'

interface ProjectProps {
  title: string
  description: string[]
  repoUrl: string
  demoUrl?: string
  technologies: string[]
}

function Project({
  title,
  description,
  repoUrl,
  demoUrl,
  technologies,
}: ProjectProps) {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'flex',
            gap: 1,
          }}
        >
          <Tooltip title="View Source">
            <IconButton href={repoUrl} target="_blank" size="small">
              <GitHub />
            </IconButton>
          </Tooltip>
          {demoUrl && (
            <Tooltip title="Live Demo">
              <IconButton href={demoUrl} target="_blank" size="small">
                <OpenInNew />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Typography variant="h5" gutterBottom color="primary">
          {title}
        </Typography>

        <Box sx={{ mt: 2 }}>
          {description.map((point, idx) => (
            <Box
              key={idx}
              sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}
            >
              <Star sx={{ mr: 1, mt: 0.5 }} fontSize="small" color="primary" />
              <Typography>{point}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {technologies.map(tech => (
            <Chip key={tech} label={tech} size="small" variant="outlined" />
          ))}
        </Box>
      </Box>
    </Paper>
  )
}

const PersonalProjects: React.FC = () => {
  const projects: ProjectProps[] = [
    {
      title: 'Personal Portfolio Website (← You are here! 👋)',
      description: [
        "Plot twist: This is the very website you're looking at right now",
        'Modern, responsive portfolio built with React, TypeScript, and Material-UI',
        "Implements accessibility considerations and dark mode support (try it, it's cool)",
        'Features component-based architecture for maintainability (meta: like this component!)',
      ],
      repoUrl: 'https://github.com/keithwalsh/keithwalsh.github.io',
      demoUrl: 'https://keithwalsh.github.io',
      technologies: ['React', 'TypeScript', 'Material-UI', 'Vite'],
    },
    {
      title: 'React Markdown Table',
      description: [
        'React component for rendering and editing markdown tables with TypeScript support',
        'Built with Material-UI for an intuitive interface',
        'Features include column sorting and row operations',
        'Maintains markdown compatibility with customizable styling options',
      ],
      repoUrl: 'https://github.com/keithwalsh/react-markdown-table-ts',
      demoUrl:
        'https://main--67509fe7e9653ea59a634ef5.chromatic.com/?path=/docs/components-markdowntable--docs&globals=backgrounds.grid:!false;backgrounds.value:transparent&singleStory=true',
      technologies: ['React', 'TypeScript', 'Material-UI', 'Markdown'],
    },
    {
      title: 'Jira Data ETL',
      description: [
        'An ETL (Extract, Transform, Load) utility for Jira data analysis',
        'Thes tool extracts data from a Jira Cloud instance',
        'The extracted data is transformed into a structured format suitable for a SQL DB',
        'It then loads it into a database for easy reporting',
      ],
      repoUrl: 'https://github.com/keithwalsh/jira-data-etl',
      technologies: ['Python', 'Jira API', 'SQLAlchemy', 'Pandas'],
    },
    {
      title: 'React Spreadsheet',
      description: [
        'A lightweight, fully-typed React spreadsheet component',
        'Features including CSV export, cell formatting, clipboard operations, and undo/redo functionality',
        'Built with TypeScript and Material-UI',
        'Ssupports theming, row/column operations, and multi-cell selection while maintaining a clean, modern interface',
      ],
      repoUrl: 'https://github.com/keithwalsh/react-spreadsheet-ts',
      demoUrl:
        'https://main--66fec51ab2591570ea1067cd.chromatic.com/?path=/docs/spreadsheet--docs&globals=backgrounds.grid:!false;backgrounds.value:transparent&singleStory=true',
      technologies: ['React', 'TypeScript', 'Material-UI', 'Redux'],
    },
  ]
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center', mb: 4 }}
      >
        <Coffee sx={{ mr: 2 }} /> Personal Projects
      </Typography>
      <Grid container spacing={3}>
        {projects.map(project => (
          <Grid item xs={12} key={project.title}>
            <Project {...project} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default PersonalProjects
