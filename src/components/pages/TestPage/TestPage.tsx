import { Container } from '@mui/material';
import { MarkdownTable } from 'react-markdown-table-ts';
import { AutocompleteStory } from './AutocompleteStory';

export const TestPage = () => {
  const sampleData = [
    ['Package ID', 'Weight (kg)', 'Status', 'Destination'],
    ['PKG-2024-001', '12.50', 'In Transit', 'Dublin, IE'],
    ['PKG-2024-002', '3.75', 'Delivered', 'New York, US'],
    ['PKG-2024-003', '8.20', 'Processing', 'Frankfurt, DE'],
    ['PKG-2024-004', '5.60', 'In Transit', 'London, GB']
  ]
  return (
    <Container maxWidth="lg">
    <MarkdownTable
    inputData={sampleData}
    showLineNumbers={true}
/>
<AutocompleteStory />
</Container>
  );  
};
