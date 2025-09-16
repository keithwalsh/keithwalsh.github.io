/**
 * @fileoverview Displays the result of a cron expression, including controls for
 * copying and generating random expressions, with animated feedback.
 */

import React, { useState } from 'react';
import { useTheme, Paper, Typography, Box, TextField, Alert, IconButton, Tooltip, Stack } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { motion } from 'framer-motion';

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
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();

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
          maxWidth: '480px',
        }}
      >
        <Stack
          direction="column"
          sx={{
            mx: { xs: 2, sm: 3, md: 4, lg: 4, xl: 4 },
          }}
        >
          <Stack direction="row">
            <Typography variant="subtitle1" sx={{ width: '100%' }} />
            <Stack direction="row" spacing={1}>
              <Tooltip title="Generate Random Cron Expression" placement="top" arrow>
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
                      animation: isRolling ? 'diceRoll 0.6s ease-in-out' : 'none',
                      transformOrigin: 'center',
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy to Clipboard" placement="top" arrow>
                <IconButton
                  size="small"
                  onClick={handleCopyClick}
                >
                  <ContentCopy
                    sx={{
                      fontSize: '0.8em',
                      animation: isCopying ? 'copyPulse 0.5s ease-in-out' : 'none',
                      transformOrigin: 'center',
                      color: 'primary.main',
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
          <Box>
            <motion.div
              animate={
                isFocused
                  ? {
                      boxShadow: [
                        `0 0 0 0px ${theme.palette.primary.main}40`,
                        `0 0 0 1px ${theme.palette.primary.main}40`,
                        `0 0 0 2px ${theme.palette.primary.main}40`,
                        `0 0 1px 3px ${theme.palette.primary.main}40`,
                        `0 0 2px 4px ${theme.palette.primary.main}40`,
                        `0 0 3px 5px ${theme.palette.primary.main}40`,
                        `0 0 4px 6px ${theme.palette.primary.main}40`,
                        `0 0 3px 5px ${theme.palette.primary.main}40`,
                        `0 0 2px 4px ${theme.palette.primary.main}40`,
                        `0 0 1px 3px ${theme.palette.primary.main}40`,
                        `0 0 0 2px ${theme.palette.primary.main}40`,
                        `0 0 0 0px ${theme.palette.primary.main}40`,
                      ],
                    }
                  : {
                      boxShadow: `0 0 0 0px ${theme.palette.primary.main}00`,
                    }
              }
              transition={{
                duration: isFocused ? 2 : 0.3,
                repeat: isFocused ? Infinity : 0,
                ease: [0.37, 0, 0.63, 1], // Smoother breathing curve
                times: isFocused
                  ? [0, 0.1, 0.2, 0.35, 0.5, 0.6, 0.65, 0.7, 0.8, 0.9, 0.95, 1]
                  : undefined,
              }}
              style={{
                borderRadius: '4px',
                display: 'block',
                width: '100%',
              }}
            >
              <TextField
                value={cronExpression}
                variant="outlined"
                onChange={handleExpressionChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
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
                      lg: '1.5em',
                      xl: '1.5em',
                    },
                    p: 1,
                  },
                  '& .MuiOutlinedInput-root': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '1px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.light',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiOutlinedInput-root.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </motion.div>
          </Box>
        </Stack>
        <Alert
          severity={isValid ? 'info' : 'error'}
          sx={{
            mt: 2,
            '&.MuiAlert-root': {
              mx: { xs: 2, sm: 3, md: 4, lg: 4, xl: 4 },
            },
          }}>
          <Typography variant="body2">
            <strong>{isValid ? '' : 'Error:'}</strong> {description}
          </Typography>
        </Alert>
      </Paper>
    </>
  );
};

export default CronExpressionResult;
