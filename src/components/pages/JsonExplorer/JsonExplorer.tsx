import React, { useState } from "react";
import { VscJson, VscClearAll, VscChromeRestore } from "react-icons/vsc";
import { JsonFormatter } from "./components";
import { useToggle, fetchJsonData, performJsonQuery } from "./utils";
import {
    Switch,
    Select,
    FormControlLabel,
    MenuItem,
    InputLabel,
    FormControl,
    TextField,
    Button,
    Box,
    Container,
    Divider,
    Typography,
    IconButton
} from "@mui/material";
import { InstructionsCard } from "../BrowserMockup/components/FileUploader";
import { Inline } from "../../shared-components";

const JsonExplorer = () => {
    const [jsonData, setJsonData] = useState("");
    const [query, setQuery] = useState("");
    const [selectedLength, setSelectedLength] = useState<number | false>(false);
    const [selectedDepth, setSelectedDepth] = useState<number | false>(false);
    const [isActiveDisplayDataTypes, handleToggleDisplayDataTypes] = useToggle();
    const [isActiveDisplayObjectSize, handleToggleDisplayObjectSize] = useToggle();

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => setJsonData(event.target.value);
    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value);
    const clearAllText = () => setJsonData("");

    const handlePerformQuery = () => performJsonQuery(jsonData, query, setJsonData);

    return (
        <Container>
            <Box>
                        <Button
                            variant="outlined"
                            startIcon={<VscJson />}
                            onClick={() => fetchJsonData("/data/example.json", setJsonData)}
                        >
                            Example JSON
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<VscClearAll />}
                            onClick={clearAllText}
                        >
                            Clear
                        </Button>
            </Box>
            <Inline showDivider={false}>
                <InstructionsCard
                    heading="How to Use"
                    body={
                        <ol>
                            <li>Paste or load JSON data into the input field</li>
                            <li>Use the JSON Path Input to query specific data (e.g., user.name)</li>
                            <li>Toggle display options for data types and object sizes</li>
                            <li>Adjust collapse depth and string length limits</li>
                            <li>View formatted JSON output with syntax highlighting</li>
                        </ol>
                    }
                />
                <Box
                    sx={{
                        width: '100%',
                        minWidth: { xs: 280, sm: 280, md: 290, lg: 340, xl: 370 },
                        minHeight: 210,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                >
                    <TextField
                        label="JSON Path Input"
                        placeholder="Enter JSON dot notation e.g. user.name"
                        value={query}
                        onChange={handleQueryChange}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handlePerformQuery}
                        disabled={!query.trim() || !jsonData.trim()}
                    >
                        Execute Query
                    </Button>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isActiveDisplayDataTypes}
                                        onChange={handleToggleDisplayDataTypes}
                                    />
                                }
                                label="Data Types"
                                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isActiveDisplayObjectSize}
                                        onChange={handleToggleDisplayObjectSize}
                                    />
                                }
                                label="Object Size"
                                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel id="collapse-label">Collapse</InputLabel>
                                <Select
                                    size="small"
                                    labelId="collapse-label"
                                    label="Collapse"
                                    value={selectedDepth === false ? "" : selectedDepth}
                                    onChange={(event) => setSelectedDepth(Number(event.target.value) || false)}
                                >
                                    <MenuItem value={0}>Collapse All</MenuItem>
                                    <MenuItem value={1}>Depth 1</MenuItem>
                                    <MenuItem value={2}>Depth 2</MenuItem>
                                    <MenuItem value={3}>Depth 3</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl size="small" sx={{ minWidth: 140 }}>
                                <InputLabel id="string-limit-label">String Limit</InputLabel>
                                <Select
                                    size="small"
                                    labelId="string-limit-label"
                                    label="String Limit"
                                    value={selectedLength === false ? "" : selectedLength}
                                    onChange={(event) => setSelectedLength(Number(event.target.value) || false)}
                                >
                                    <MenuItem value={20}>Length 20</MenuItem>
                                    <MenuItem value={40}>Length 40</MenuItem>
                                    <MenuItem value={50}>Length 50</MenuItem>
                                    <MenuItem value={100}>Length 100</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
            </Inline>
            <Divider sx={{ my: 4 }} />
            <Inline showDivider={false}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: "50%"
                }}>
                    <Typography
                        component="label"
                        htmlFor="textarea"
                        sx={{
                            display: "block",
                            fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
                            fontWeight: "400",
                            fontSize: "1rem",
                            lineHeight: "1.4375em",
                            letterSpacing: "0.00938em",
                            color: "rgba(0, 0, 0, 0.6);",
                            marginBottom: "4px",
                        }}
                    >
                        Input
                    </Typography>
                    <TextField
                        multiline
                        minRows={10}
                        value={jsonData}
                        onChange={handleChange}
                        placeholder="Paste JSON here"
                        fullWidth
                    />
                </Box>
                <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    width: "50%"
                }}>

                    <Inline showDivider={false}>
                        <Typography
                            component="label"
                            htmlFor="textarea"
                            sx={{
                                display: "block",
                                fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
                                fontWeight: "400",
                                width: "100%",
                                fontSize: "1rem",
                                lineHeight: "1.4375em",
                                letterSpacing: "0.00938em",
                                color: "rgba(0, 0, 0, 0.6);",
                                marginBottom: "4px",
                            }}
                        >
                            Output
                        </Typography>
                        <IconButton aria-label="copy" size="small" onClick={() => navigator.clipboard.writeText(jsonData)}>
                            <VscChromeRestore fontSize="inherit" />
                        </IconButton>
                    </Inline>
                    <JsonFormatter
                        data={jsonData}
                        displayDataTypes={isActiveDisplayDataTypes}
                        displayObjectSize={isActiveDisplayObjectSize}
                        collapseStringsAfterLength={selectedLength}
                        collapsed={selectedDepth}
                    />
                </Box>
            </Inline>
        </Container>
    );
};

export default JsonExplorer;
