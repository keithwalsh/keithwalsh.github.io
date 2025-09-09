import * as React from 'react';
import { FormGroup, FormControlLabel, Switch } from '@mui/material';

interface Props {
    label: string;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

function LinSwitch(props: Props) {
    return (
        <FormGroup className={props.className}>
            <FormControlLabel
                control={
                    <Switch
                        checked={props.checked}
                        onChange={props.onChange}
                        sx={{
                            padding: 1,
                            marginLeft: { xs:-0.5, sm: 0 },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: 'success.light',
                                opacity: 1,
                            },
                            '& .MuiSwitch-track': {
                                borderRadius: 22 / 2,
                                backgroundColor: 'action.disabledBackground',
                                opacity: 1,
                                '&::before, &::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 16,
                                    height: 16,
                                },
                                '&::before': {
                                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="white" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
                                    left: 12,
                                },
                                '&::after': {
                                    backgroundImage: theme => theme.palette.mode === 'dark'
                                        ? `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent('#E0E0E0')}" d="M19,13H5V11H19V13Z" /></svg>')`
                                        : `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="white" d="M19,13H5V11H19V13Z" /></svg>')`,
                                    right: 12,
                                },
                            },
                            '& .MuiSwitch-thumb': {
                                boxShadow: 'none',
                                width: 16,
                                height: 16,
                                margin: 0.25,
                                color: theme => theme.palette.mode === 'dark' ? theme.palette.grey[300] : 'white',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': {
                                backgroundColor: 'white',
                            },
                        }}
                    />
                }
                label={props.label}
                labelPlacement="start"
                sx={{
                    marginLeft: 0,
                    '& .MuiFormControlLabel-label': {
                        fontSize: '0.75em',
                        whiteSpace: 'nowrap',
                        fontWeight: '400',
                        color: props.checked ? 'text.primary' : 'text.secondary',
                    },
                }}
            />
        </FormGroup>
    );
}

export { LinSwitch }