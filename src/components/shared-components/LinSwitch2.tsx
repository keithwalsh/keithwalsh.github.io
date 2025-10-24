import * as React from 'react';
import { alpha, Switch, Stack, Typography } from '@mui/material';

interface Props {
  labelStart: string;
  labelEnd: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

function LinSwitch2(props: Props) {
  return (
    <Stack direction="row" sx={{ alignItems: 'center' }} className={props.className}>
      <Typography
        sx={{
          fontSize: '0.75em',
          fontWeight: '500',
          color: props.checked ? 'text.disabled' : 'text.primary',
          marginRight: 0
        }}
      >
        {props.labelStart}
      </Typography>
      <Switch
        checked={props.checked}
        onChange={props.onChange}
        sx={{
          padding: 1,
          '& .MuiButtonBase-root.Mui-checked': {
            '&:hover': {
              backgroundColor: theme => alpha(theme.palette.success.light, 0.04)
            }
          },
          '& .MuiButtonBase-root': {
            '&:hover': {
              backgroundColor: theme => alpha(theme.palette.error.light, 0.04)
            }
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: theme => alpha(theme.palette.success.light, 0.7),
            opacity: 1
          },
          '& .MuiButtonBase-root.MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(16px)',
            color: theme => alpha(theme.palette.success.light, 0.7),
            '&:hover': {
              color: theme => alpha(theme.palette.success.light, 0.7)
            }
          },
          '& .MuiButtonBase-root.MuiSwitch-switchBase': {
            color: theme => alpha(theme.palette.error.light, 0.7),
            '&:hover': {
              color: theme => alpha(theme.palette.error.light, 0.7)
            }
          },
          '& .MuiSwitch-track': {
            width: 38,
            borderRadius: 22 / 2,
            backgroundColor: theme => alpha(theme.palette.error.light, 0.7),
            opacity: 1,
            '&::before, &::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 16,
              height: 16
            }
          },
          '& .MuiSwitch-thumb': {
            boxShadow: 'none',
            width: 16,
            height: 16,
            margin: 0.25,
            color: 'white'
          },
          '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': {
            backgroundColor: 'white'
          }
        }}
      />
      <Typography
        sx={{
          fontSize: '0.75em',
          fontWeight: '500',
          color: props.checked ? 'text.primary' : 'text.disabled',
          marginLeft: -0.4
        }}
      >
        {props.labelEnd}
      </Typography>
    </Stack>
  );
}

export { LinSwitch2 };