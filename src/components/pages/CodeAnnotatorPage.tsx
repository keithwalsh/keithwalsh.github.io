import {
  Container,
  CssBaseline,
  Box,
  TextField,
  Stack,
} from '@mui/material'
import { useState, useRef, useEffect } from 'react'
import { CodeHighlighter } from 'code-annotator'
import 'code-annotator/styles'
import { LinSwitch } from '../shared-components/LinSwitch'
import { LinSelect } from '../shared-components/LinSelect'
import { Inline } from '../shared-components'

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

export function CodeAnnotatorPage() {
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
  
  useEffect(() => {
    const syncHeights = () => {
      if (box1Ref.current && box2Ref.current) {
        const box2Height = box2Ref.current.offsetHeight
        box1Ref.current.style.minHeight = `${box2Height}px`
      }
    }
    
    // Sync heights initially and on window resize
    syncHeights()
    window.addEventListener('resize', syncHeights)
    
    // Use ResizeObserver for more accurate tracking if available
    if (window.ResizeObserver && box2Ref.current) {
      const resizeObserver = new ResizeObserver(syncHeights)
      resizeObserver.observe(box2Ref.current)
      
      return () => {
        window.removeEventListener('resize', syncHeights)
        resizeObserver.disconnect()
      }
    }
    
    return () => window.removeEventListener('resize', syncHeights)
  }, [language, showLineNumbers]) // Re-sync when content might change

  return (
    <Container>
      <CssBaseline />
      <Inline showDivider={false}>
        <Stack sx={{ width: { sm: '100%', md: '50%' } }}>
          <Box 
            id="box-1"
            ref={box1Ref}
          >
          </Box>
          <Box>
            <TextField
              label="Code Input"
              value={code}
              onChange={e => setCode(e.target.value)}
              multiline
              minRows={6}
              maxRows={20}
              fullWidth
              variant="outlined"
            />
          </Box>
        </Stack>
        <Stack sx={{ width: { sm: '100%', md: '50%' } }}>
          <Box 
            id="box-2"
            ref={box2Ref}
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
          <Box>
            <CodeHighlighter
              code={code}
              language={language}
              showLineNumbers={showLineNumbers}
              title="Code Output"
            />
          </Box>
        </Stack>
      </Inline>
    </Container>
  )
}
