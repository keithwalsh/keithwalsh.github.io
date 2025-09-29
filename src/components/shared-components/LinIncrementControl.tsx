/**
 * @fileoverview Reusable increment/decrement control component with customizable
 * styling and value constraints for numeric inputs with sliding number animation.
 */

import { useEffect, useMemo, useRef } from 'react';
import { alpha, Box, Button, ButtonGroup, Stack, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

interface LinIncrementControlProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
}

export function LinIncrementControl({
  value,
  onChange,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  disabled = false,
  label,
}: LinIncrementControlProps) {
  const scrollListRef = useRef<HTMLDivElement>(null);
  const handleDecrement = () => value - step >= min && onChange(value - step);
  const handleIncrement = () => value + step <= max && onChange(value + step);

  const itemHeight = 30; // Height of each number item
  const allNumbers = useMemo(
    () => Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => min + i * step),
    [min, max, step]
  );
  const currentValueIndex = Math.round((value - min) / step)

  useEffect(() => {
    if (scrollListRef.current && currentValueIndex >= 0) {
      Object.assign(scrollListRef.current.style, {
        marginTop: `${-currentValueIndex * itemHeight}px`,
        transition: 'margin-top 300ms ease-in-out'
      });
    }
  }, [value, currentValueIndex, itemHeight]);

  return (
    <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="body2" color="text.secondary">{label}</Typography>
    <ButtonGroup variant="outlined" sx={{ height: `${itemHeight}px` }}>
    <Button
      variant="outlined"
      startIcon={<Remove />}
      onClick={handleDecrement}
      disabled={disabled || value <= min}
      sx={{
        px: 1,
        borderRight: 'none !important',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderColor: (theme) =>
          disabled || value <= min
          ? `${alpha(theme.palette.primary.main, 0.5)} !important`
          : undefined,
        '& .MuiButton-startIcon': { mx: 0 }
      }}
    />
    <Button
      disabled
      sx={{
        marginLeft: '0.01px !important',
        marginRight: '1px',
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
        }}
      >
        <Box ref={scrollListRef}>
          {allNumbers.map((num) => (
            <Typography
              variant="button"
              key={num}
              sx={{
                display: 'block',
                color: 'primary.main',
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
      disabled={disabled || value >= max}
      sx={{
        minWidth: 0,
        px: 1,
        borderLeft: 'none !important',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderColor: (theme) =>
          disabled || value >= max
          ? `${alpha(theme.palette.primary.main, 0.5)} !important`
          : undefined,
        '& .MuiButton-endIcon': { mx: 0 }
      }}
    />
    </ButtonGroup>
    </Stack>
  );
}