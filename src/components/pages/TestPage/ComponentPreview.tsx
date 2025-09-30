/**
 * @fileoverview Component preview demonstrating MUI Autocomplete combo box
 * with documentation-style presentation including expandable code section.
 */

import { useState } from 'react';
import { alpha, Autocomplete, Box, Button, Collapse, Container, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { CodeHighlighter } from '../CodeAnnotator/components';
import { LinSelect } from '../../shared-components';


// Define the movie option type
interface MovieOption {
  label: string;
  year: number;
}

// Prop table types
type PropControlType = 'boolean' | 'number' | 'string' | 'select' | 'text' | 'callback' | 'object';

interface PropDefinition {
  name: string;
  description: string;
  type: string;
  defaultValue: string | number | boolean;
  controlType: PropControlType;
  options?: string[];
  currentValue?: any;
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
  
  // Prop table state
  const [componentWidth, setComponentWidth] = useState(300);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<'small' | 'medium'>('medium');
  const [variant, setVariant] = useState<'outlined' | 'filled' | 'standard'>('outlined');
  const [placeholder, setPlaceholder] = useState('Search movies...');
  
  // Define props for the table
  const propDefinitions: PropDefinition[] = [
    {
      name: 'disabled',
      description: 'If true, the component is disabled.',
      type: 'boolean',
      defaultValue: false,
      controlType: 'boolean',
      currentValue: disabled
    },
    {
      name: 'loading',
      description: 'If true, the component is in a loading state.',
      type: 'boolean',
      defaultValue: false,
      controlType: 'boolean',
      currentValue: loading
    },
    {
      name: 'size',
      description: 'The size of the component.',
      type: '"small" | "medium"',
      defaultValue: 'medium',
      controlType: 'select',
      options: ['small', 'medium'],
      currentValue: size
    },
    {
      name: 'variant',
      description: 'The variant to use for the TextField.',
      type: '"outlined" | "filled" | "standard"',
      defaultValue: 'outlined',
      controlType: 'select',
      options: ['outlined', 'filled', 'standard'],
      currentValue: variant
    },
    {
      name: 'width',
      description: 'The width of the component in pixels.',
      type: 'number',
      defaultValue: 300,
      controlType: 'number',
      currentValue: componentWidth
    },
    {
      name: 'placeholder',
      description: 'Placeholder text for the input field.',
      type: 'string',
      defaultValue: 'Search movies...',
      controlType: 'text',
      currentValue: placeholder
    },
    {
      name: 'onChange',
      description: 'Callback fired when the value changes.',
      type: '(event: SyntheticEvent, value: T) => void',
      defaultValue: '-',
      controlType: 'callback'
    },
    {
      name: 'options',
      description: 'Array of options.',
      type: 'T[]',
      defaultValue: '-',
      controlType: 'object'
    }
  ];
  
  const handlePropChange = (propName: string, value: any) => {
    switch (propName) {
      case 'disabled':
        setDisabled(value);
        break;
      case 'loading':
        setLoading(value);
        break;
      case 'size':
        setSize(value);
        break;
      case 'variant':
        setVariant(value);
        break;
      case 'width':
        setComponentWidth(value);
        break;
      case 'placeholder':
        setPlaceholder(value);
        break;
    }
  };
  
  const renderControl = (prop: PropDefinition) => {
    switch (prop.controlType) {
      case 'boolean':
        return (
          <Switch
            checked={prop.currentValue}
            onChange={(e) => handlePropChange(prop.name, e.target.checked)}
            size="small"
          />
        );
      case 'number':
        return (
          <TextField
            type="number"
            value={prop.currentValue}
            onChange={(e) => handlePropChange(prop.name, Number(e.target.value))}
            size="small"
            sx={{ width: 100 }}
            variant="outlined"
          />
        );
      case 'text':
        return (
          <TextField
            value={prop.currentValue}
            onChange={(e) => handlePropChange(prop.name, e.target.value)}
            size="small"
            sx={{ width: 200 }}
            variant="outlined"
          />
        );
      case 'select':
        return (
          <LinSelect
            label=""
            values={prop.options?.map(option => ({ value: option, label: option })) || []}
            selectedValue={prop.currentValue}
            onChange={(value) => handlePropChange(prop.name, value)}
            width={120}
          />
        );
      case 'callback':
      case 'object':
        return (
          <Typography variant="body2" color="text.disabled">
            -
          </Typography>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ ml: 0 }}>
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
        borderRadius: 3,
        mb: 3
      }}>
        {/* Demo Area */}
        <Box sx={{ 
          paddingTop: 3,
          paddingBottom: 0,
          borderTopLeftRadius: 6,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: 6,
          borderBottomRightRadius: 0,
          borderStyle: 'solid',
          borderTopWidth: '1px',
          borderRightWidth: '1px',
          borderBottomWidth: '0px',
          borderLeftWidth: '1px',
          borderColor: 'divider', 
          display: 'flex', 
          justifyContent: 'center',
          bgcolor: 'background.paper'
        }}>
          
          <Autocomplete
            disablePortal
            options={top100Films}
            sx={{ width: componentWidth }}
            value={selectedMovie}
            onChange={(_, newValue) => setSelectedMovie(newValue)}
            disabled={disabled}
            loading={loading}
            size={size}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Movie" 
                variant={variant}
                placeholder={placeholder}
              />
            )}
          />
        </Box>

        {/* Toolbar */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'right',
          p: 0,
          m: 0
        }}>
            <Box
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: codeExpanded ? 0 : 6,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderStyle: 'solid',
                borderTopWidth: '0px',
                borderRightWidth: '0px',
                borderBottomWidth: '1px',
                borderLeftWidth: '1px',
                borderColor: 'divider', 
                flexGrow: 1
            }}></Box>
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
                borderTopLeftRadius: 6,
                borderBottomLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomRightRadius: codeExpanded ? 0 : 6,
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
        </Box>

        {/* Expandable Code Section */}
        <Collapse in={codeExpanded}>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 6,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 6,
              borderStyle: 'solid',
              borderTopWidth: '0px',
              borderRightWidth: '1px',
              borderBottomWidth: '1px',
              borderLeftWidth: '1px',
              borderColor: 'divider',
            }}>
              <CodeHighlighter
                code={comboCodeTsx}
                language="tsx"
                showLineNumbers
                disableBorders
              />
          </Box>
        </Collapse>
      </Box>

      {/* Props Table Section */}
      <Box sx={{ mt: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: '1.25rem',
            lineHeight: 1.5,
            fontWeight: 600,
            letterSpacing: '0px',
            mb: 1
          }}>
          Props
        </Typography>
        
        <TableContainer 
          component={Paper} 
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            '& .MuiTable-root': {
              minWidth: 650
            }
          }}>
          <Table size="small">
            <TableHead
              sx={{ 
                fontWeight: 600,
                fontSize: '0.875rem',
                bgcolor: theme => alpha(theme.palette.text.primary, 0.02),
                width: '15%'
              }}
            >
              <TableRow>
                <TableCell sx={{ width: '15%' }}>Name</TableCell>
                <TableCell sx={{ width: '40%' }}>Description</TableCell>
                <TableCell sx={{ width: '15%' }}>Type</TableCell>
                <TableCell sx={{ width: '15%' }}>Default</TableCell>
                <TableCell sx={{ width: '15%' }}>Control</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {propDefinitions.map((prop) => (
                <TableRow 
                  key={prop.name}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': {
                      bgcolor: theme => alpha(theme.palette.text.primary, 0.02),
                    }
                  }}>
                  <TableCell>
                    <Typography 
                      component="code" 
                      sx={{ 
                        fontFamily: 'monospace',
                        fontSize: '0.8125rem',
                        color: 'primary.main',
                        fontWeight: 600
                      }}>
                      {prop.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 400,
                        fontSize: '0.8125rem',
                        lineHeight: 1.5,
                        letterSpacing: '0px',
                        color: theme => alpha(theme.palette.text.primary, 0.7),
                      }}
                    >
                      {prop.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      component="code" 
                      sx={{ 
                        fontFamily: 'monospace',
                        fontWeight: 400,
                        fontSize: '0.75rem',
                        lineHeight: 1.5,
                        letterSpacing: '0px',
                        color: theme => alpha(theme.palette.text.primary, 0.8),
                        bgcolor: theme => alpha(theme.palette.primary.light, 0.1),
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 1,
                        borderStyle: 'solid',
                        borderWidth: '1px',
                        borderColor: theme => alpha(theme.palette.primary.main, 0.1),
                        display: 'inline-block'
                      }}>
                      {prop.type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      component="code" 
                      sx={{ 
                        fontFamily: 'monospace',
                        fontWeight: 400,
                        fontSize: '0.75rem',
                        lineHeight: 1.5,
                        letterSpacing: '0px',
                        color: theme => alpha(theme.palette.text.primary, 0.8),
                        bgcolor: theme => alpha(theme.palette.text.primary, 0.035),
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 1,
                        borderStyle: 'solid',
                        borderWidth: '1px',
                        borderColor: theme => alpha(theme.palette.text.primary, 0.1),
                        display: 'inline-block'
                      }}>
                      {String(prop.defaultValue)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {renderControl(prop)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
    </Container>
  );
};
