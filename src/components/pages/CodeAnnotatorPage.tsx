import {
  Container,
  CssBaseline,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { useState } from 'react'
import { CodeHighlighter } from 'code-annotator'
import 'code-annotator/styles'

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

  return (
    <Container maxWidth="lg">
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
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
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 180 }} size="small">
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
              labelId="language-select-label"
              value={language}
              label="Language"
              onChange={e => setLanguage(e.target.value)}
            >
              {LANGUAGE_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={showLineNumbers}
                onChange={e => setShowLineNumbers(e.target.checked)}
                color="primary"
                inputProps={{ 'aria-label': 'Show line numbers' }}
              />
            }
            label="Show line numbers"
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <CodeHighlighter
            code={code}
            language={language}
            showLineNumbers={showLineNumbers}
            title="Code Output"
          />
        </Box>
      </Box>
    </Container>
  )
}
