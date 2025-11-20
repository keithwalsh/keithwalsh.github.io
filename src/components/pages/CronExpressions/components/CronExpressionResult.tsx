/**
 * @fileoverview Displays the result of a cron expression, including controls for
 * copying and generating random expressions, with animated feedback.
 */

import React, { useState } from 'react';
import { Paper, Typography, Box, TextField, Alert, IconButton, Tooltip, Stack } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';

interface CronExpressionResultProps {
  cronExpression: string;
  description: string;
  onCopy: () => void;
  generateRandomCronExpression: () => void;
  onExpressionChange?: (expression: string) => void;
  isValid?: boolean;
}

const CronExpressionResult: React.FC<CronExpressionResultProps> = ({
  cronExpression,
  description,
  onCopy,
  generateRandomCronExpression,
  onExpressionChange,
  isValid = true,
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleDiceClick = () => {
    setIsRolling(true);
    generateRandomCronExpression();
    // Reset animation after it completes
    setTimeout(() => setIsRolling(false), 600);
  };

  const handleCopyClick = () => {
    setIsCopying(true);
    onCopy();
    // Reset animation after it completes
    setTimeout(() => setIsCopying(false), 500);
  };

  const handleExpressionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newExpression = event.target.value;
    if (onExpressionChange) {
      onExpressionChange(newExpression);
    }
  };

  return (
    <>
      <style>{`
        @keyframes diceRoll {
          0% { transform: rotate(0deg) scale(1); }
          12.5% { transform: rotate(-45deg) scale(1.1); }
          25% { transform: rotate(-90deg) scale(1.1); }
          37.5% { transform: rotate(-135deg) scale(1.1); }
          50% { transform: rotate(-180deg) scale(1.2); }
          62.5% { transform: rotate(-205deg) scale(1.1); }
          75% { transform: rotate(-250deg) scale(1.1); }
          87.5% { transform: rotate(-295deg) scale(1.1); }
          100% { transform: rotate(-360deg) scale(1); }
        }
        @keyframes copyPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
      <Paper
        elevation={0}
        sx={{
          px: 0,
          maxWidth: '680px',
        }}
      >
        <Stack
          direction="column"
          sx={{
            ml: { xs: 2, sm: 3, md: 4, lg: 4, xl: 4 },
            mr: { xs: 2, sm: 3, md: 0, lg: 0, xl: 0 },
          }}
        >
          <Stack direction="row">
            <Typography variant="subtitle1" sx={{ width: '100%' }} />
            <Stack direction="row" spacing={1}>
              <Tooltip
                title="Generate Random Cron Expression"
                placement="top"
                arrow
              >
                <IconButton
                  size="small"
                  onClick={handleDiceClick}
                  sx={{
                    fontSize: '1em',
                    color: 'primary.main',
                  }}
                >
                  <GiPerspectiveDiceSixFacesRandom
                    style={{
                      animation: isRolling
                        ? 'diceRoll 0.6s ease-in-out'
                        : 'none',
                      transformOrigin: 'center',
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy to Clipboard" placement="top" arrow>
                <IconButton size="small" onClick={handleCopyClick}>
                  <ContentCopy
                    sx={{
                      fontSize: '0.8em',
                      animation: isCopying
                        ? 'copyPulse 0.5s ease-in-out'
                        : 'none',
                      transformOrigin: 'center',
                      color: 'primary.main',
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
          <Box>
            <TextField
              value={cronExpression}
              variant="outlined"
              onChange={handleExpressionChange}
              slotProps={{
                input: {
                  autoComplete: 'off',
                  autoCorrect: 'off',
                  autoCapitalize: 'off',
                  spellCheck: false,
                },
              }}
              sx={{
                fontFamily: 'monospace',
                width: '100%',
                '& .MuiInputBase-input': {
                  width: '100%',
                  textAlign: 'center',
                  fontFamily: 'monospace',
                  fontSize: {
                    xs: '1.5em',
                    sm: '1.5em',
                    md: '1.5em',
                    lg: '2em',
                    xl: '2em',
                  },
                  padding: '0.5rem 0.75rem',
                  color: (theme) => theme.palette.mode === 'light' ? '#4F7577' : undefined,
                  backgroundColor: (theme) => theme.palette.mode === 'light' ? '#F5FAFA' : undefined,
                  backgroundClip: 'padding-box',
                  borderRadius: '2px',
                },
                '& .MuiOutlinedInput-root': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: (theme) => theme.palette.mode === 'light' ? '1px solid #D8E3E4' : undefined,
                    borderRadius: '2px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: (theme) => theme.palette.mode === 'light' ? '1px solid #D8E3E4' : undefined,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: (theme) => theme.palette.mode === 'light' ? '1px solid #14767D' : undefined,
                    boxShadow: (theme) => theme.palette.mode === 'light' ? '0px 0px 10px rgba(20, 118, 125, 0.8)' : undefined,
                    transition: 'border-color .15s ease-in-out, box-shadow .15s ease-in-out',
                  },
                },
              }}
            />
          </Box>
        </Stack>
        <Alert
          severity={isValid ? 'info' : 'error'}
          sx={{
            mt: 2,
            '&.MuiAlert-root': {
              ml: { xs: 2, sm: 3, md: 4, lg: 4, xl: 4 },
              mr: { xs: 2, sm: 3, md: 0, lg: 0, xl: 0 },
              mb: 3,
            },
          }}
        >
          <Typography variant="body2">
            <strong>{isValid ? '' : 'Error:'}</strong> {description}
          </Typography>
        </Alert>
      </Paper>
    </>
  )
};

export default CronExpressionResult;
