import { alpha, Box, Container, CssBaseline, Stack, TextField, Typography } from '@mui/material'
import { useState, useRef, useEffect } from 'react'
import { CodeHighlighter } from './components'
import { LinSwitch } from '../../shared-components/LinSwitch'
import { LinSelect } from '../../shared-components/LinSelect'
import { LinInline } from '../../shared-components'

// Common languages for code highlighting
const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'sql', label: 'SQL' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
]

export function CodeAnnotator() {
  const [code, setCode] = useState(`<?php
// Remove
echo "Hello [-Room-]";
// Add
echo "Hello [+World+]";
?>`)
  const [language, setLanguage] = useState('php')
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  
  const box1Ref = useRef<HTMLDivElement>(null)
  const box2Ref = useRef<HTMLDivElement>(null)
  const box3Ref = useRef<HTMLDivElement>(null)
  const box4Ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const syncHeights = () => {
      // Sync box-1 with box-2 height
      if (box1Ref.current && box2Ref.current) {
        const box2Height = box2Ref.current.offsetHeight
        box1Ref.current.style.minHeight = `${box2Height}px`
      }
      
      // Sync box-4 with box-3 height
      if (box3Ref.current && box4Ref.current) {
        const box3Height = box3Ref.current.offsetHeight
        box4Ref.current.style.minHeight = `${box3Height}px`
      }
    }
    
    // Sync heights initially and on window resize
    syncHeights()
    window.addEventListener('resize', syncHeights)
    
    // Use ResizeObserver for more accurate tracking if available
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(syncHeights)
      
      // Observe both box-2 and box-3 for changes
      if (box2Ref.current) resizeObserver.observe(box2Ref.current)
      if (box3Ref.current) resizeObserver.observe(box3Ref.current)
      
      return () => {
        window.removeEventListener('resize', syncHeights)
        resizeObserver.disconnect()
      }
    }
    
    return () => window.removeEventListener('resize', syncHeights)
  }, [language, showLineNumbers]) // Re-sync when content might change

  return (
    <Container
      sx={{
        ml:{ xs: 1, sm: 3, md: 3, lg: 3, xl: 3 },
      }}
    >
      <Box
        sx={{
          mr:{ xs: 2, sm: 6, md: 6, lg: 6, xl: 3 },
        }}
      >
      <CssBaseline />
      <LinInline showDivider={false}>
        <Stack
          sx={{
            width: { sm: '100%', md: '50%' },
          }}
        >
          <Box 
            id="box-1"
            ref={box1Ref}
            sx={{
              mb: 1.5,
              display: { xs: 'none', sm: 'none', md: 'block', lg: 'block', xl: 'block' }
            }}
          >
          </Box>
          <Box 
            id="box-3"
            ref={box3Ref}
          >
            <Typography variant="subtitle1" sx={{ width: '100%' }}>Input</Typography>
            <TextField
              value={code}
              onChange={e => setCode(e.target.value)}
              multiline
              minRows={6}
              maxRows={20}
              fullWidth
              variant="outlined"
              slotProps={{
                input: {
                  autoComplete: 'off',
                  autoCorrect: 'off',
                  autoCapitalize: 'off',
                  spellCheck: false,
                },
              }}
              sx={{
                '& .MuiInputBase-root': {
                 py: 1,
                },
                '& .MuiInputBase-input': {
                 color: theme => alpha(theme.palette.text.primary, 0.9),
                 fontSize: '0.75em',
                 lineHeight: '1.5',
                 fontFamily: "SFMono-Regular, Menlo, Consolas, Monaco, Liberation Mono, Courier New, monospace",
                }
             }}
            />
          </Box>
        </Stack>
        <Stack sx={{ width: { sm: '100%', md: '50%' } }}>
          <Box 
            id="box-2"
            ref={box2Ref}
            sx={{
              mb: 1.5,
              mt: { xs: 3, sm: 3, md: 0, lg: 0, xl: 0 },
            }}
          >
            <Stack direction="row" spacing={2}>
              <Box>
                <LinSelect
                  label="Language"
                  values={LANGUAGE_OPTIONS}
                  selectedValue={language}
                  onChange={value => setLanguage(value as string)}
                />
              </Box>
              <Box>
                <LinSwitch
                  label="Show line numbers"
                  checked={showLineNumbers}
                  onChange={e => setShowLineNumbers(e.target.checked)}
                />
              </Box>
            </Stack>
          </Box>
          <Box 
            id="box-4"
            ref={box4Ref}
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="subtitle1" sx={{ width: '100%' }}>Output</Typography>
            <CodeHighlighter
              code={code}
              language={language}
              showLineNumbers={showLineNumbers}
            />
          </Box>
          </Stack>
        </LinInline>
      </Box>
    </Container>
  )
}
