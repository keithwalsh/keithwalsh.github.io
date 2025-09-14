// Style objects and theme-related functions for CronSyntaxBar component

import type { Theme } from '@mui/material';
import type { SxProps } from '@mui/material';

/**
 * Main container styles for the component
 */
export const getMainContainerStyles = (): SxProps<Theme> => ({
  p: { xs: 2, sm: 3, md: 4 }, 
  position: "relative", 
  width: "100%"
});

/**
 * Rail styles that connects the badges
 */
export const getRailStyles = (theme: Theme): SxProps<Theme> => ({
  position: "absolute",
  top: "25%",
  left: "calc(8% + 25px)",
  right: "calc(8% + 25px)",
  borderTop: `2px dashed ${theme.palette.grey[400]}`,
  zIndex: 0,
});

/**
 * Badge styles with theme integration
 */
export const getBadgeStyles = (
  isActive: boolean, 
  theme: Theme
): SxProps<Theme> => ({
  width: { xs: 30, sm: 30, md: 40, lg: 40, xl: 40 },
  height: { xs: 30, sm: 30, md: 40, lg: 40, xl: 40 },
  borderRadius: { xs: 2, sm: 2, md: 3, lg: 3, xl: 3 },
  bgcolor: isActive ? theme.palette.secondary.main : theme.palette.primary.main,
  color: theme.palette.common.white,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: isActive ? theme.shadows[8] : theme.shadows[3],
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    boxShadow: theme.shadows[6],
  }
});

/**
 * Info panel card styles
 */
export const getCardStyles = (theme: Theme): SxProps<Theme> => ({
  width: "100%", 
  maxWidth: 800, 
  minHeight: 200,
  mx: "auto",
  backgroundColor: theme.palette.action.hover,
});

/**
 * Code block styles for examples
 */
export const getCodeBlockStyles = (theme: Theme): SxProps<Theme> => ({
  fontFamily: 'monospace',
  bgcolor: theme.palette.action.hover,
  px: 1.5,
  py: 0.5,
  borderRadius: 1,
  fontSize: '0.75rem',
  fontWeight: 600,
  minWidth: 80,
  textAlign: 'center'
});

/**
 * Typography styles for field labels
 */
export const getFieldLabelStyles = (isActive: boolean): SxProps<Theme> => ({
  whiteSpace: "pre-line", 
  lineHeight: 1.3,
  minHeight: 40,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  maxWidth: 100,
  fontWeight: isActive ? 600 : 400,
  transition: "font-weight 0.2s ease",
  cursor: "pointer"
});

/**
 * Hidden element styles for screen readers
 */
export const getHiddenStyles = (): SxProps<Theme> => ({
  position: 'absolute',
  left: -10000,
  width: 1,
  height: 1,
  overflow: 'hidden'
});

/**
 * Special characters table container styles
 */
export const getTableContainerStyles = (): SxProps<Theme> => ({
  mt: 3, 
  maxWidth: 800, 
  mx: "auto",
  width: "100%"
});

/**
 * Table styles for special characters
 */
export const getTableStyles = (theme: Theme): SxProps<Theme> => ({
  '& .MuiTableHead-root': {
    '& .MuiTableCell-root': {
      fontWeight: 600,
      fontSize: '0.875rem',
      py: 1.5
    }
  },
  '& .MuiTableBody-root': {
    '& .MuiTableCell-root': {
      py: 1,
      fontSize: '0.8rem'
    },
    '& .MuiTableRow-root': {
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      }
    }
  }
});

/**
 * Symbol cell styles in the table
 */
export const getSymbolCellStyles = (theme: Theme): SxProps<Theme> => ({
  fontFamily: 'monospace',
  fontSize: '1.25rem',
  fontWeight: 700,
  textAlign: 'center',
  py: 1,
  lineHeight: 1.5,
  border: theme.palette.mode === 'dark' 
    ? '1px solid hsla(210, 14%, 28%, 0.3)' 
    : '1px solid rgba(204, 230, 255, 0.8)',
  borderRadius: 1,
  width: 45,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(0, 59, 117, 0.3)' 
    : 'hsl(210, 100%, 96%)'
});

/**
 * Example code styles in table
 */
export const getTableCodeStyles = (theme: Theme): SxProps<Theme> => ({
  fontFamily: 'monospace',
  backgroundColor: theme.palette.grey[100],
  px: 0.75,
  py: 0.25,
  borderRadius: 0.5,
  fontSize: '0.75rem',
  fontWeight: 600,
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.grey[100]
  })
});

/**
 * Responsive container styles for different sections
 */
export const getResponsiveContainerStyles = (): SxProps<Theme> => ({
  position: "relative", 
  width: "100%", 
  maxWidth: { xs: '100%', sm: 800, md: 1000 }, 
  mx: "auto" 
});



/**
 * Field range text styles (small text under field labels)
 */
export const getFieldRangeStyles = (): SxProps<Theme> => ({
  fontSize: "0.85em", 
  color: "text.secondary", 
  mt: 0.5
});

/**
 * Info panel description text styles
 */
export const getInfoDescriptionStyles = (): SxProps<Theme> => ({
  mb: 3, 
  lineHeight: 1.6
});

/**
 * Example item container styles (for code + description pairs)
 */
export const getExampleItemStyles = (): SxProps<Theme> => ({
  display: 'flex', 
  alignItems: 'center', 
  gap: 2
});


/**
 * Special characters section title styles
 */
export const getSpecialCharactersTitleStyles = (): SxProps<Theme> => ({
  mb: 2
});

/**
 * Table row styles with hover effects
 */
export const getTableRowStyles = (theme: Theme): SxProps<Theme> => ({
  '&:hover': { 
    backgroundColor: theme.palette.action.hover 
  }, 
  '&:last-child td, &:last-child th': { 
    border: 0 
  }
});

/**
 * Table example chip styles
 */
export const getTableExampleChipStyles = (): SxProps<Theme> => ({
  fontFamily: 'monospace', 
  mb: 0.5,
  fontSize: '0.8rem'
});
