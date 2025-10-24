/**
 * @fileoverview Reusable component preview system similar to Storybook for
 * displaying components with interactive props and code examples.
 */

import { useState } from 'react';
import { alpha, Box, Button, Collapse, Container, Grid, Input, Paper, Slider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { CodeHighlighter } from '../CodeAnnotator/components';
import { LinSelect, LinSwitch2 } from '../../shared-components';

// Prop table types
type PropControlType = 'boolean' | 'number' | 'string' | 'select' | 'text' | 'callback' | 'object';

export interface PropDefinition {
  name: string;
  description: string;
  type: string;
  defaultValue: string;
  controlType: PropControlType;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

export interface ComponentPreviewProps {
  title: string;
  description: string;
  codeExample: string;
  propDefinitions: PropDefinition[];
  renderComponent: (props: Record<string, any>) => React.ReactNode;
  initialProps?: Record<string, any>;
}

export const ComponentPreview = ({
  title,
  description,
  codeExample,
  propDefinitions,
  renderComponent,
  initialProps = {}
}: ComponentPreviewProps) => {
  const [codeExpanded, setCodeExpanded] = useState(false);
  
  // Initialize dynamic props state
  const [componentProps, setComponentProps] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = { ...initialProps };
    propDefinitions.forEach(prop => {
      if (!(prop.name in initial) && prop.controlType !== 'callback' && prop.controlType !== 'object') {
        initial[prop.name] = prop.defaultValue;
      }
    });
    return initial;
  });
  
  const handlePropChange = (propName: string, value: any) => {
    setComponentProps(prev => ({
      ...prev,
      [propName]: value
    }));
  };
  
  const renderControl = (prop: PropDefinition) => {
    const currentValue = componentProps[prop.name];
    
    switch (prop.controlType) {
      case 'boolean':
        return (
          <LinSwitch2
            labelStart="True"
            labelEnd="False"
            checked={currentValue ?? false}
            onChange={(e) => handlePropChange(prop.name, e.target.checked)}
          />
        );
      case 'number':
        const min = prop.min ?? 0;
        const max = prop.max ?? 800;
        const step = prop.step ?? 1;
        
        const handleSliderChange = (_: Event, newValue: number | number[]) => {
          handlePropChange(prop.name, newValue as number);
        };

        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          handlePropChange(prop.name, event.target.value === '' ? min : Number(event.target.value));
        };

        const handleBlur = () => {
          if (currentValue < min) {
            handlePropChange(prop.name, min);
          } else if (currentValue > max) {
            handlePropChange(prop.name, max);
          }
        };

        return (
          <Box sx={{ width: 120 }}>
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
              <Grid size="grow">
                <Slider
                  size="small"
                  value={typeof currentValue === 'number' ? currentValue : min}
                  onChange={handleSliderChange}
                  aria-labelledby="input-slider"
                  min={min}
                  max={max}
                  step={step}
                />
              </Grid>
              <Grid>
                <Input
                  value={currentValue}
                  size="small"
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  inputProps={{
                    step,
                    min,
                    max,
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                  }}
                  sx={{
                    width: 40,
                    '& .MuiInputBase-input': {
                      fontSize: '0.875rem'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 'text':
        return (
          <TextField
            value={currentValue ?? ''}
            onChange={(e) => handlePropChange(prop.name, e.target.value)}
            size="small"
            sx={{width: 200 }}
            variant="outlined"
          />
        );
      case 'select':
        return (
          <LinSelect
            label=""
            values={prop.options?.map(option => ({ value: option, label: option })) || []}
            selectedValue={currentValue}
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
          {title}
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            fontSize: '1rem',
            lineHeight: 1.625,
            letterSpacing: 0
          }}>
          {description}
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
          {renderComponent(componentProps)}
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
                code={codeExample}
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
          <Table size="small" sx={{ tableLayout: 'fixed' }}>
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
                <TableCell sx={{ width: '30%' }}>Description</TableCell>
                <TableCell sx={{ width: '15%' }}>Type</TableCell>
                <TableCell sx={{ width: '20%' }}>Default</TableCell>
                <TableCell sx={{ width: '20%' }}>Control</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {propDefinitions.map((prop) => {
                return (
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
                        {prop.defaultValue}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {renderControl(prop)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
    </Container>
  );
};
