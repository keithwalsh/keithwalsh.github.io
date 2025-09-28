/**
 * @fileoverview Reusable increment/decrement control component with customizable
 * styling and value constraints for numeric inputs with sliding number animation.
 */

import { Box, Button, ButtonGroup, Typography, alpha } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useEffect, useRef } from 'react';

interface LinIncrementControlProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function LinIncrementControl({
  value,
  onChange,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  disabled = false,
}: LinIncrementControlProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const handleDecrement = () => {
    const newValue = value - step;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleIncrement = () => {
    const newValue = value + step;
    if (newValue <= max) {
      onChange(newValue);
    }
  };

  const isDecrementDisabled = disabled || value <= min;
  const isIncrementDisabled = disabled || value >= max;

  // Height of each number item
  const itemHeight = 30;

  // Generate all numbers from min to max
  const generateAllNumbers = () => {
    const numbers = [];
    for (let i = min; i <= max; i += step) {
      numbers.push(i);
    }
    return numbers;
  };

  const allNumbers = generateAllNumbers();
  const currentValueIndex = allNumbers.findIndex(num => num === value);

  useEffect(() => {
    if (listRef.current && currentValueIndex >= 0) {
      const list = listRef.current;
      const marginTop = -currentValueIndex * itemHeight;
      
      list.style.marginTop = `${marginTop}px`;
      list.style.transition = 'margin-top 300ms ease-in-out';
      
    }
  }, [value, currentValueIndex, itemHeight]);

  return (
          <ButtonGroup
            variant="outlined"
            sx={{
              height: `${itemHeight}px`,
            }}
          >

            <Button
              variant="outlined"
              startIcon={<Remove />}
              onClick={handleDecrement}
              disabled={isDecrementDisabled}
              sx={{
                px: 1,
                borderRight: 'none !important',
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderColor: (theme) =>
                  isDecrementDisabled
                  ? `${alpha(theme.palette.primary.main, 0.5)} !important`
                  : undefined,
                '& .MuiButton-startIcon': {
                  mx: 0,
                }
              }}
            />

            <Button
              disabled
              sx={{
                marginLeft: '0.01px !important',
                marginRight: '1px !important',
                borderLeft: 'none !important',
                borderRight: 'none !important',
                backgroundColor: 'none !important',
                borderColor: theme => `${alpha(theme.palette.primary.main, 0.5)} !important`,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  height: `${itemHeight}px`,
                  overflow: 'hidden',
                  textAlign: 'center',
                }}
              >
                <Box 
                  ref={listRef}
                  sx={{
                    width: '100%',
                  }}
                >
                  {allNumbers.map((num) => (
                    <Typography
                      variant="button"
                      key={num}
                      sx={{
                        display: 'block',
                        color: 'primary.main',
                        fontSize: '1rem',
                        lineHeight: `${itemHeight}px`,
                      }}
                    >
                      {num}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Button>

            <Button
              variant="outlined"
              endIcon={<Add />}
              onClick={handleIncrement}
              disabled={isIncrementDisabled}
              sx={{
                minWidth: 0,
                px: 1,
                borderLeft: 'none !important',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderColor: (theme) =>
                  isIncrementDisabled
                  ? `${alpha(theme.palette.primary.main, 0.5)} !important`
                  : undefined,
                '& .MuiButton-endIcon': {
                  mx: 0,
                }
              }}
            />

          </ButtonGroup>
  );
}