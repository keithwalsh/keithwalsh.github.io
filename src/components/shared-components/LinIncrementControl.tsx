/**
 * @fileoverview Reusable increment/decrement control component with customizable
 * styling and value constraints for numeric inputs with sliding number animation.
 */

import { Box, IconButton, alpha } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useEffect, useRef } from 'react';

interface LinIncrementControlProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  width?: string | number;
  sx?: object;
}

export function LinIncrementControl({
  value,
  onChange,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  disabled = false,
  width = '160px',
  sx = {},
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

  // Generate all numbers from min to max (like the HTML example)
  const generateAllNumbers = () => {
    const numbers = [];
    for (let i = min; i <= max; i += step) {
      numbers.push(i);
    }
    return numbers;
  };

  const allNumbers = generateAllNumbers();
  const currentValueIndex = allNumbers.findIndex(num => num === value);

  // Update animation when value changes (exactly like the JavaScript example)
  useEffect(() => {
    if (listRef.current && currentValueIndex >= 0) {
      const list = listRef.current;
      const marginTop = -currentValueIndex * itemHeight;
      
      // Apply the animation exactly like the JavaScript example
      list.style.marginTop = `${marginTop}px`;
      list.style.transition = 'margin-top 300ms ease-in-out';
      
      console.log('Animation Applied:', {
        value,
        currentValueIndex,
        marginTop: `${marginTop}px`
      });
    }
  }, [value, currentValueIndex, itemHeight]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '30px',
        backgroundColor: (theme) => alpha(theme.palette.primary.light, 0.03),
        borderRadius: '8px',
        borderColor: (theme) => alpha(theme.palette.primary.main, 0.5),
        borderWidth: '1px',
        borderStyle: 'solid',
        padding: '8px 12px',
        minWidth: width,
        gap: '12px',
        transition: 'background-color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
        position: 'relative',
        '&:hover': {
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.06),
            borderColor: 'primary.main'
        },
        ...sx,
      }}
    >
      <IconButton
        onClick={handleDecrement}
        disabled={isDecrementDisabled}
        sx={{
            padding: '4px',
        }}
      >
        <Remove fontSize="small" />
      </IconButton>
      
      {/* Exactly like the HTML example structure */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60px',
        height: `${itemHeight}px`,
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        <div 
          ref={listRef}
          style={{
            width: '100%'
          }}
        >
          {allNumbers.map((num) => (
            <div
              key={num}
              style={{
                display: 'block',
                width: '100%',
                height: `${itemHeight}px`,
                color: 'rgb(25, 118, 210)',
                fontSize: '1rem',
                lineHeight: `${itemHeight}px`,
                fontFamily: 'monospace'
              }}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
      
      <IconButton
        onClick={handleIncrement}
        disabled={isIncrementDisabled}
        sx={{
          padding: '4px',
        }}
      >
        <Add fontSize="small" />
      </IconButton>
    </Box>
  );
}