import React from 'react';
import { Typography, Container, Paper, Box, Chip, Grid } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import StarIcon from '@mui/icons-material/Star';

interface Project {
  role: string;
  company: string;
  period: string;
  achievements: string[];
  technologies?: string[];
}

const WorkProjects: React.FC = () => {
  const projects: Project[] = [
    {
      role: "Data Analyst",
      company: "Pitney Bowes, Dublin",
      period: "Mar. 2024 – Dec. 2024",
      achievements: [
        "Developed a rerate tool using Python and SQL to recalculate client invoices",
        "Built automated Python/SQL scripts to detect invoice errors and validate refund calculations, cutting manual effort by 50%+",
        "Designed and maintained internal and client-facing dashboards using Tableau and Power BI",
        "Received leadership recognition for developing a universal analytics toolkit",
        "Earned Cross-Functional Collaboration Award (2023–2024) with four quarterly nominations"
      ],
      technologies: ["Python", "SQL", "Tableau", "Power BI", "Power Automate", "Jira"]
    },
    {
      role: "Client Support Manager",
      company: "Pitney Bowes, Dublin",
      period: "Nov. 2019 – Feb. 2021",
      achievements: [
        "Led a team of 13 agents, managing performance reviews and resource allocation",
        "Developed automated KPI reports for performance monitoring",
        "Reduced escalations by 25% through improved cross-functional workflows",
        "Received 3rd Place in Continuous Innovation Award (2021) for Client Connect & Support Platform"
      ],
      technologies: ["KPI Automation", "Team Management", "Process Optimization"]
    },
    {
      role: "Client Support Business Analyst",
      company: "Pitney Bowes, Dublin",
      period: "Jun. 2018 – Oct. 2019",
      achievements: [
        "Developed browser extension to automate tasks, boosting productivity 23%",
        "Created Agent Proficiency Score (APS) system for performance tracking",
        "Reduced average handling times by 15% through custom automation scripts"
      ],
      technologies: ["Browser Extensions", "Automation", "Analytics"]
    },
    {
      role: "Payments & Risk Management Analyst",
      company: "BetBright / 888, Dublin",
      period: "Apr. 2015 – Jun. 2018",
      achievements: [
        "Reduced payment disputes by 28% through risk assessment initiatives",
        "Halved client verification times while maintaining KYC/AML compliance",
        "Led payment gateway API integrations for enhanced transaction security"
      ],
      technologies: ["Risk Management", "KYC/AML", "Payment APIs"]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <WorkIcon sx={{ mr: 2 }} /> Professional Projects
      </Typography>
      
      <Grid container spacing={3}>
        {projects.map((project, index) => (
          <Grid item xs={12} key={index}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box>
                <Typography variant="h5" gutterBottom color="primary">
                  {project.role}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {project.company} | {project.period}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  {project.achievements.map((achievement, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                      <StarIcon sx={{ mr: 1, mt: 0.5 }} fontSize="small" color="primary" />
                      <Typography>{achievement}</Typography>
                    </Box>
                  ))}
                </Box>

                {project.technologies && (
                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {project.technologies.map((tech, idx) => (
                      <Chip key={idx} label={tech} size="small" variant="outlined" />
                    ))}
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default WorkProjects;
