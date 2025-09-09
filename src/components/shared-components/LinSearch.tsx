/**
 * @fileoverview Search component with text field and search button for user input handling.
 */

import * as React from "react";
import { Box, Button, TextField } from "@mui/material";
import { FaSearch } from "react-icons/fa";

type Props = {
    label?: string;
    value?: string;
    placeholder?: string;
    onClick?: () => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    width?: string;
};

function LinSearch({
    label,
    value,
    placeholder,
    onClick,
    onChange,
    width = '100%',
}: Props) {
    return (
        <Box sx={{ 
            position: 'relative',
            display: 'flex',
            alignItems: 'stretch',
            marginBottom: 1,
            whiteSpace: 'nowrap'
        }}>
            <Box sx={{ display: 'inline-block', width: '100%' }}>
                <Box component="form" noValidate autoComplete="off" sx={{ width: '100%' }}>
                    <TextField
                        id="outlined-textarea"
                        label={label}
                        placeholder={placeholder}
                        size="small"
                        value={value}
                        onChange={onChange}
                        spellCheck={false}
                        sx={{
                            width: width,
                            '& .MuiInputBase-root': {
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                            },
                        }}
                    />
                </Box>
            </Box>
            <Box sx={{ display: 'inline-block' }}>
                <Button
                    sx={{
                        minWidth: '48px', 
                        minHeight: '40px',
                        position: 'relative',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: 0,
                        boxShadow: 'none',
                        '&.MuiButtonBase-root:hover': {
                            boxShadow: 'none',
                        },
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        marginLeft: '-1px',
                    }}
                    onClick={onClick}
                    variant="contained"
                >
                    <FaSearch />
                </Button>
            </Box>
        </Box>
    );
};

export { LinSearch };
