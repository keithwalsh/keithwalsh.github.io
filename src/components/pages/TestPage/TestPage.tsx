import { Box } from '@mui/material';
import { ComponentPreview } from './ComponentPreview';

export const TestPage = () => {

  return (
    <Box sx={{ 
      flex: 1,
      padding: 3,
      transition: 'all 0.5s ease-in-out',
      mx: { xs: 2, sm: 3, md: 3, lg: 3, xl: 3 },
  }}>
    <ComponentPreview />
    </Box>
  );  
};
