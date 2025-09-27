/**
 * @fileoverview Text to ASCII converter component using figlet.js for creating
 * ASCII art from text input with various font options and styling controls.
 */

import { useState, useCallback, useEffect } from 'react';
import { Box, Card, CardContent, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Button, Paper, Alert, Chip, Stack, IconButton, Tooltip } from '@mui/material';
import { ContentCopy, Download, Refresh } from '@mui/icons-material';
import figlet from 'figlet';

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

const SAMPLE_TEXTS = [
  'HELLO',
  'ASCII ART',
  'WELCOME',
  'CODE',
  'FIGLET',
  'TEXT',
];


export function TextToAscii({}: TextToAsciiProps) {
  const [inputText, setInputText] = useState('HELLO WORLD');
  const [selectedFont, setSelectedFont] = useState('Standard');
  const [asciiOutput, setAsciiOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

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
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true,
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
  }, [inputText, selectedFont]);

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

  const handleSampleTextClick = (sampleText: string) => {
    setInputText(sampleText);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Card elevation={3}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Text to ASCII Art Converter
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Convert your text into ASCII art using various fonts. Perfect for creating banners, headers, or decorative text.
          </Typography>

          {/* Sample Text Chips */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Quick samples:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {SAMPLE_TEXTS.map((sample) => (
                <Chip
                  key={sample}
                  label={sample}
                  variant="outlined"
                  size="small"
                  onClick={() => handleSampleTextClick(sample)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Stack>
          </Box>

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

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Font Style</InputLabel>
                <Select
                  value={selectedFont}
                  label="Font Style"
                  onChange={(e) => setSelectedFont(e.target.value)}
                >
                  {POPULAR_FONTS.map((font) => (
                    <MenuItem key={font} value={font}>
                      {font}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={generateAscii}
                disabled={isLoading || !inputText.trim()}
              >
                Regenerate
              </Button>
            </Box>
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
              backgroundColor: '#f5f5f5',
              border: '2px dashed #ddd',
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
                      sx={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download as text file">
                    <IconButton
                      size="small"
                      onClick={handleDownload}
                      sx={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
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
                    margin: 0,
                    color: '#333',
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
            <Typography variant="subtitle2" gutterBottom>
              Tips:
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              • Try different fonts to find the perfect style for your text
              • Shorter text works best for complex fonts
              • Use the copy button to easily share your ASCII art
              • Download as a text file to save your creations
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
