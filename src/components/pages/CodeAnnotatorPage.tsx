import { Container } from '@mui/material'
import 'code-annotator/dist/index.css'
import CodeEditor from 'code-annotator'

export function CodeAnnotatorPage() {
  return (
    <Container maxWidth="lg">
      <CodeEditor />
    </Container>
  )
}
