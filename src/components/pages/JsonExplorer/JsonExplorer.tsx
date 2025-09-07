import React, { useState } from "react";
import { VscJson, VscClearAll, VscChromeRestore } from "react-icons/vsc";
import Grid from "@mui/material/Grid2";
import { JsonFormatter } from "./components";
import { useToggle, fetchJsonData, performJsonQuery } from "./utils";
import { Switch, Select, FormControlLabel, MenuItem, InputLabel, FormControl, TextField, Button, Box } from "@mui/material";

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
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <Box>
                            <Box>
                                <TextField
                                    label="Input"
                                    multiline
                                    minRows={10}
                                    value={jsonData}
                                    onChange={handleChange}
                                    placeholder="Paste JSON here"
                                />
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
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={6}>
                        <Box>
                            <TextField
                                label="JSON Path Input"
                                placeholder="Enter JSON dot notation e.g. user.name"
                                onChange={handleQueryChange}
                                onClick={handlePerformQuery}
                            />
                            <Box>
                                <Box>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={isActiveDisplayDataTypes}
                                                onChange={handleToggleDisplayDataTypes}
                                            />
                                        }
                                        label="Data Types"
                                        className="whitespace-nowrap text-xs sm:text-sm md:text-base"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={isActiveDisplayObjectSize}
                                                onChange={handleToggleDisplayObjectSize}
                                            />
                                        }
                                        label="Object Size"
                                        className="whitespace-nowrap text-xs sm:text-sm md:text-base absolute"
                                    />
                                </Box>
                            </Box>
                            <Box>
                                <Box>
                                    <Box>
                                        <FormControl size="small" sx={{ minWidth: 120 }}>
                                            <InputLabel id="collapse-label">Collapse</InputLabel>
                                            <Select
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
                                    </Box>
                                    <Box>
                                        <FormControl size="small" sx={{ minWidth: 120 }}>
                                            <InputLabel id="string-limit-label">String Limit</InputLabel>
                                            <Select
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
                        </Box>
                        <fieldset className="relative">
                            <JsonFormatter
                                label="Output"
                                data={jsonData}
                                className="pb-[26px]"
                                displayDataTypes={isActiveDisplayDataTypes}
                                displayObjectSize={isActiveDisplayObjectSize}
                                collapseStringsAfterLength={selectedLength}
                                collapsed={selectedDepth}
                            />
                            <Box>
                                <Button
                                    variant="outlined"
                                    startIcon={<VscChromeRestore />}
                                    onClick={clearAllText}
                                >
                                    Copy
                                </Button>
                            </Box>
                        </fieldset>
                    </Grid>
                </Grid>
    );
};

export default JsonExplorer;
