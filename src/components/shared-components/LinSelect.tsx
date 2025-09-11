import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select"; // Make sure to import SelectChangeEvent

interface Props {
    label: string;
    values: { value: string | number | boolean; label: string }[];
    selectedValue: string | number | boolean;
    onChange: (value: string | number | boolean) => void;
}

function LinSelect({
    label,
    values,
    selectedValue,
    onChange,
}: Props) {
    const handleChange = (
        event: SelectChangeEvent<string>
    ) => {
        const stringValue = event.target.value;
        // Find the original value by matching the string representation
        const originalItem = values.find(item => String(item.value) === stringValue);
        if (originalItem) {
            onChange(originalItem.value);
        }
    };

    return (
        <FormControl fullWidth>
            <InputLabel 
                id="demo-select-small-label"
                sx={{
                    fontSize: ".749875rem",
                    marginTop: "-9.25px",
                    "&.MuiInputLabel-shrink": {
                        transform: "translate(15px, 2px) scale(0.875)",
                        letterSpacing: "0.05em",
                    },
                }}
            >
                {label}
            </InputLabel>
            <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={String(selectedValue)}
                label={label}
                onChange={handleChange}
                sx={{
                    "& .MuiSelect-select": {
                        padding: "0px",
                        textIndent: "15px",
                        lineHeight: "32px",
                        height: "30px",
                        minWidth: { xs: "80px", sm: "90px", md: "80px", lg: "90px", xl: "90px" },
                        fontSize: ".749875rem",
                    },
                    "& .MuiOutlinedInput-notchedOutline legend": {
                        marginLeft: "1.75px",
                        "& > span": {
                            fontSize: ".675rem",
                        },
                    },
                }}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            "& .MuiMenuItem-root": {
                                fontSize: ".749875rem",
                            },
                        },
                    },
                }}
            >
                {values.map((item) => (
                    <MenuItem key={String(item.value)} value={String(item.value)}>
                        {item.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export { LinSelect }