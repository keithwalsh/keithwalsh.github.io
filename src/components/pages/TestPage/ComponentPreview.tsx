/**
 * @fileoverview Component preview demonstrating MUI Autocomplete combo box
 * with documentation-style presentation including expandable code section.
 */

import { useState } from 'react';
import { alpha, Autocomplete, Box, Button, Collapse, IconButton, TextField, Typography } from '@mui/material';
import { CenterFocusWeak, ContentCopy, MoreVert, Refresh } from '@mui/icons-material';
import { SiStackblitz } from "react-icons/si";
import { AiOutlineCodeSandbox } from "react-icons/ai";
import { CodeHighlighter } from '../CodeAnnotator/components';


// Define the movie option type
interface MovieOption {
  label: string;
  year: number;
}

// Top 100 films as per IMDB
const top100Films: MovieOption[] = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
  { label: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { label: 'The Good, the Bad and the Ugly', year: 1966 },
  { label: 'Fight Club', year: 1999 },
  { label: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
  { label: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
  { label: 'Forrest Gump', year: 1994 },
  { label: 'Inception', year: 2010 },
  { label: 'The Lord of the Rings: The Two Towers', year: 2002 },
  { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { label: 'Goodfellas', year: 1990 },
  { label: 'The Matrix', year: 1999 },
  { label: 'Seven Samurai', year: 1954 },
  { label: 'Star Wars: Episode IV - A New Hope', year: 1977 },
  { label: 'City of God', year: 2002 },
  { label: 'Se7en', year: 1995 },
  { label: 'The Silence of the Lambs', year: 1991 },
  { label: "It's a Wonderful Life", year: 1946 },
  { label: 'Life Is Beautiful', year: 1997 },
  { label: 'The Usual Suspects', year: 1995 },
  { label: 'Léon: The Professional', year: 1994 },
  { label: 'Spirited Away', year: 2001 },
  { label: 'Saving Private Ryan', year: 1998 },
  { label: 'Once Upon a Time in the West', year: 1968 },
];

const comboCodeTsx = `import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import top100Films from './top100Films';

export default function ComboBox() {
  return (
    <Autocomplete
      disablePortal
      options={top100Films}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Movie" />}
    />
  );
}`;

export const ComponentPreview = () => {
  const [codeExpanded, setCodeExpanded] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieOption | null>(null);

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: '1.625rem',
            lineHeight: 1.5,
            fontWeight: 700,
            letterSpacing: '0.1px',
            mb: 0.5
          }}>
          Combo box
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            fontSize: '1rem',
            lineHeight: 1.625,
            letterSpacing: 0
          }}>
          The value must be chosen from a predefined set of allowed values.
        </Typography>
      </Box>

      {/* Demo Container */}
      <Box sx={{ 
        border: '1px solid', 
        borderColor: 'divider', 
        borderRadius: 3,
        mb: 3,
        overflow: 'hidden'
      }}>
        {/* Demo Area */}
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'center',
          bgcolor: 'background.paper'
        }}>
          
          <Autocomplete
            disablePortal
            options={top100Films}
            sx={{ width: 300 }}
            value={selectedMovie}
            onChange={(_, newValue) => setSelectedMovie(newValue)}
            renderInput={(params) => <TextField {...params} label="Movie" />}
          />
        </Box>

        {/* Toolbar */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center',
          px: 1,
          py: 0.25,
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: theme => alpha(theme.palette.action.disabledBackground, 0.01)
        }}>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="text"
              onClick={() => setCodeExpanded(!codeExpanded)}
              sx={{ 
                textTransform: 'none',
                padding: 1,
                transition: '120ms ease-in',
                letterSpacing: 0,
                minWidth: '64px',
                lineHeight: 1.25,
                height: '26px',
                borderRadius: 3,
                borderColor: theme => alpha(theme.palette.primary.light, 0.3),
                borderStyle: 'solid',
                borderWidth: '1px',
                fontWeight: 500,
                fontSize: '0.8125rem',
                '&:hover': {
                  borderColor: theme => alpha(theme.palette.primary.light, 0.8),
                  backgroundColor: theme => alpha(theme.palette.primary.light, 0.09)
                }
              }}
            >
              {codeExpanded ? 'Collapse code' : 'Expand code'}
            </Button>
            
            <IconButton 
              tabIndex={-1}
              title="Edit in StackBlitz"
              sx={{
                color: 'text.primary',
                transition: '100ms ease-in',
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: theme => alpha(theme.palette.action.hover, 0.07)
                }
              }}
            >
              <SiStackblitz
                style={{
                  fontSize: '1rem'
                }}
              />
            </IconButton>
            
            <IconButton  
              tabIndex={-1}
              title="Edit in CodeSandbox"
              sx={{
                color: 'text.primary',
                transition: '100ms ease-in',
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: theme => alpha(theme.palette.action.hover, 0.07)
                }
              }}
            >
              <AiOutlineCodeSandbox
                style={{
                  fontSize: '1.1rem'
                }}
              />
            </IconButton>
            
            <IconButton 
              tabIndex={-1}
              title="Copy the source"
              sx={{
                color: 'text.primary',
                transition: '100ms ease-in',
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: theme => alpha(theme.palette.action.hover, 0.07)
                }
              }}
            >
              <ContentCopy
                sx={{
                  fontSize: '0.9rem',
                  transform: 'scaleY(-1)'
                }}
              />
            </IconButton>
            
            <IconButton 
              tabIndex={-1}
              title="Reset focus to test keyboard navigation"
              sx={{
                color: 'text.primary',
                transition: '100ms ease-in',
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: theme => alpha(theme.palette.action.hover, 0.07)
                }
              }}
            >
              <CenterFocusWeak
                sx={{
                  fontSize: '1rem'
                }}
              />
            </IconButton>
            
            <IconButton 
              tabIndex={-1}
              title="Reset demo"
              onClick={() => setSelectedMovie(null)}
              sx={{
                color: 'text.primary',
                transition: '100ms ease-in',
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: theme => alpha(theme.palette.action.hover, 0.07)
                }
              }}
            >
              <Refresh
                sx={{
                  fontSize: '1rem'
                }}
              />
            </IconButton>
            
            <IconButton  
              tabIndex={-1}
              title="See more"
              sx={{
                color: 'text.primary',
                transition: '100ms ease-in',
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: theme => alpha(theme.palette.action.hover, 0.07)
                }
              }}
            >
              <MoreVert
                sx={{
                  fontSize: '1rem'
                }}
              />
            </IconButton>
          </Box>
        </Box>

        {/* Expandable Code Section */}
        <Collapse in={codeExpanded}>
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ p: 0 }}>
              <CodeHighlighter
                code={comboCodeTsx}
                language="tsx"
                showLineNumbers
                disableBorders
              />
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};
