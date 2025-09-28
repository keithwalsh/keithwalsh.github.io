/**
 * @fileoverview Text to ASCII converter component using figlet.js for creating
 * ASCII art from text input with various font options and styling controls.
 */

import { useState, useCallback, useEffect } from 'react';
import { Box, TextField, Typography, Button, Paper, Alert, Stack, IconButton, Tooltip, Container } from '@mui/material';
import { ContentCopy, Download, Refresh } from '@mui/icons-material';
import figlet from 'figlet';
import { LinIncrementControl } from '../../shared-components/LinIncrementControl';
import { LinInstructionsCard } from '../../shared-components/LinInstructionsCard';
import { LinSelect } from '../../shared-components/LinSelect';
import { LinSwitch } from '../../shared-components/LinSwitch';

interface TextToAsciiProps {}

// Configure figlet to use local fonts
figlet.defaults({ fontPath: '/figlet-fonts/' });

const POPULAR_FONTS = [
  'Standard',
  'Big',
  'Small',
  'Block',
  'Slant',
  'Ghost',
  'Speed',
];

export function TextToAscii({}: TextToAsciiProps) {
  const [inputText, setInputText] = useState('HELLO WORLD');
  const [selectedFont, setSelectedFont] = useState('Standard');
  const [asciiOutput, setAsciiOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Figlet configuration options
  const [horizontalLayout, setHorizontalLayout] = useState('default');
  const [verticalLayout, setVerticalLayout] = useState('default');
  const [width, setWidth] = useState(80);
  const [whitespaceBreak, setWhitespaceBreak] = useState(true);

  const generateAscii = useCallback(async () => {
    if (!inputText.trim()) {
      setAsciiOutput('');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await new Promise<string>((resolve, reject) => {
        figlet.text(
          inputText,
          {
            font: selectedFont as any,
            horizontalLayout: horizontalLayout as any,
            verticalLayout: verticalLayout as any,
            width: width,
            whitespaceBreak: whitespaceBreak,
          },
          (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data || '');
            }
          }
        );
      });

      setAsciiOutput(result);
      setError(null);
    } catch (err) {
      console.error('Figlet error:', err);
      setError(`Failed to generate ASCII art with font "${selectedFont}". ${err instanceof Error ? err.message : 'Unknown error'}`);
      setAsciiOutput('');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, selectedFont, horizontalLayout, verticalLayout, width, whitespaceBreak]);

  // Preload figlet fonts
  useEffect(() => {
    const preloadFonts = () => {
      figlet.preloadFonts(POPULAR_FONTS, (err) => {
        if (err) {
          console.warn('Font preloading failed:', err);
        } else {
          console.log('Figlet fonts preloaded successfully');
        }
      });
    };
    
    preloadFonts();
  }, []);

  useEffect(() => {
    generateAscii();
  }, [generateAscii]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(asciiOutput);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([asciiOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascii-art-${inputText.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Convert your text into ASCII art using various fonts. Perfect for creating banners, headers, or decorative text.
          </Typography>

          {/* Input Controls */}
          <Stack spacing={3} sx={{ mb: 3 }}>
            <TextField
              label="Enter your text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type something awesome..."
              variant="outlined"
              fullWidth
              multiline
              maxRows={3}
            />

              <Stack direction="row" spacing={2}>
                <LinSelect
                  label="Font Style"
                  values={POPULAR_FONTS.map((font) => (
                      { value: font, label: font }
                  ))}
                  selectedValue={selectedFont}
                    onChange={(value) => setSelectedFont(value as string)}
                  />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Refresh />}
                  onClick={generateAscii}
                  disabled={isLoading || !inputText.trim()}
                  sx={{ width: '100%' }}
                >
                  Regenerate
                </Button>
              </Stack>

              <Stack direction="row" spacing={2}>
                <LinSelect
                  label="Horizontal Layout"
                  values={[
                    { value: 'default', label: 'Default' },
                    { value: 'full', label: 'Full' },
                    { value: 'fitted', label: 'Fitted' },
                    { value: 'controlled smushing', label: 'Controlled Smushing' },
                    { value: 'universal smushing', label: 'Universal Smushing' }
                  ]}
                  selectedValue={horizontalLayout}
                  onChange={(value) => setHorizontalLayout(value as string)}
                />

                <LinSelect
                  label="Vertical Layout"
                  values={[
                    { value: 'default', label: 'Default' },
                    { value: 'full', label: 'Full' },
                    { value: 'fitted', label: 'Fitted' },
                    { value: 'controlled smushing', label: 'Controlled Smushing' },
                    { value: 'universal smushing', label: 'Universal Smushing' }
                  ]}
                  selectedValue={verticalLayout}
                  onChange={(value) => setVerticalLayout(value as string)}
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <Typography gutterBottom>Width: {width} characters</Typography>
                <LinIncrementControl
                  value={width}
                  onChange={setWidth}
                  min={40}
                  max={200}
                  step={1}
                  disabled={isLoading || !inputText.trim()}
                />
                 <LinSwitch
                   label="Whitespace Break"
                   checked={whitespaceBreak}
                   onChange={(e) => setWhitespaceBreak(e.target.checked)}
                 />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Break lines at whitespace to fit within the specified width
                </Typography>
              </Stack>
          </Stack>

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* ASCII Output */}
          <Paper 
            variant="outlined" 
            sx={{ 
              position: 'relative',
              minHeight: 200,
              border: '2px dashed divider',
            }}
          >
            {/* Action Buttons */}
            {asciiOutput && (
              <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                <Stack direction="row" spacing={1}>
                  <Tooltip title={copySuccess ? 'Copied!' : 'Copy to clipboard'}>
                    <IconButton
                      size="small"
                      onClick={handleCopyToClipboard}
                      color={copySuccess ? 'success' : 'default'}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download as text file">
                    <IconButton
                      size="small"
                      onClick={handleDownload}
                    >
                      <Download fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            )}

            {/* Output Content */}
            <Box sx={{ p: 2, pt: asciiOutput ? 5 : 2 }}>
              {isLoading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">Generating ASCII art...</Typography>
                </Box>
              ) : asciiOutput ? (
                <Box
                  component="pre"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: { xs: '0.6rem', sm: '0.75rem', md: '0.875rem' },
                    lineHeight: 1.2,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    overflow: 'auto',
                    margin: 1,
                    color: 'text.primary',
                  }}
                >
                  {asciiOutput}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    {inputText.trim() ? 'ASCII art will appear here' : 'Enter some text to get started'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Instructions */}
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
            <LinInstructionsCard
              heading="Tips"
              body={
                <ol>
                  <li>Try different fonts to find the perfect style for your text</li>
                  <li>Shorter text works best for complex fonts</li>
                  <li>Use Advanced Settings to control layout and formatting</li>
                  <li>Adjust width for better text wrapping and appearance</li>
                  <li>Try different horizontal/vertical layouts for unique effects</li>
                  <li>Use the copy button to easily share your ASCII art</li>
                  <li>Download as a text file to save your creations</li>
                </ol>
              }
            />
          </Box>
    </Container>
  );
}
