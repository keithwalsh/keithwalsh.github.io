import React, { useState } from 'react';
import { VscJson, VscClearAll, VscChromeRestore } from 'react-icons/vsc';
import { JsonFormatter } from './components';
import { useToggle, fetchJsonData, performJsonQuery } from './utils';
import { Switch, Select, FormControlLabel, MenuItem, InputLabel, FormControl, TextField, Button, Box, Container, Divider, Typography, IconButton, Tooltip, Stack, alpha } from '@mui/material';
import { Inline, InstructionsCard } from '../../shared-components';

const JsonExplorer = () => {
  const [jsonData, setJsonData] = useState('');
  const [query, setQuery] = useState('');
  const [selectedLength, setSelectedLength] = useState<number | false>(false);
  const [selectedDepth, setSelectedDepth] = useState<number | boolean>(false);
  const [selectedIndentWidth, setSelectedIndentWidth] = useState<number>(4);
  const [isActiveDisplayArrayKey, handleToggleDisplayArrayKey] = useToggle();
  const [isActiveDisplayDataTypes, handleToggleDisplayDataTypes] = useToggle();
  const [isActiveDisplayObjectSize, handleToggleDisplayObjectSize] = useToggle();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => setJsonData(event.target.value);
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value);
  const clearAllText = () => setJsonData('');

  const handlePerformQuery = () => performJsonQuery(jsonData, query, setJsonData);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControlLabel
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.9em',
                  },
                }}
                control={
                  <Switch
                    checked={isActiveDisplayArrayKey}
                    onChange={handleToggleDisplayArrayKey}
                  />
                }
                label="Array Keys"
              />
              <FormControlLabel
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.9em',
                  },
                }}
                control={
                  <Switch
                    checked={isActiveDisplayDataTypes}
                    onChange={handleToggleDisplayDataTypes}
                  />
                }
                label="Data Types"
              />
              <FormControlLabel
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.9em',
                  },
                }}
                control={
                  <Switch
                    checked={isActiveDisplayObjectSize}
                    onChange={handleToggleDisplayObjectSize}
                  />
                }
                label="Object Size"
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="collapse-label">Collapse</InputLabel>
                <Select
                  size="small"
                  labelId="collapse-label"
                  label="Collapse"
                  value={selectedDepth === true ? 'true' : (selectedDepth === false ? '' : selectedDepth)}
                  onChange={event => {
                    const value = event.target.value;
                    if (value === 'collapse-all') {
                      setSelectedDepth(true);
                    } else {
                      setSelectedDepth(Number(value) || false);
                    }
                  }}
                >
                  <MenuItem value={''}>Expand All</MenuItem>
                  <MenuItem value="collapse-all">Collapse All</MenuItem>
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
                  value={selectedLength === false ? '' : selectedLength}
                  onChange={event => setSelectedLength(Number(event.target.value) || false)}
                >
                  <MenuItem value={''}>No Limit</MenuItem>
                  <MenuItem value={20}>Length 20</MenuItem>
                  <MenuItem value={40}>Length 40</MenuItem>
                  <MenuItem value={50}>Length 50</MenuItem>
                  <MenuItem value={100}>Length 100</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel id="indent-width-label">Indent Width</InputLabel>
                <Select
                  size="small"
                  labelId="indent-width-label"
                  label="Indent Width"
                  value={selectedIndentWidth === 4 ? '' : selectedIndentWidth}
                  onChange={event => {
                    const value = event.target.value;
                    if (value === '') {
                      setSelectedIndentWidth(4);
                    } else {
                      const num = Number(value);
                      setSelectedIndentWidth(isNaN(num) ? 4 : num);
                    }
                  }}
                >
                  <MenuItem value={''}>Default (4)</MenuItem>
                  <MenuItem value={1}>Width 1</MenuItem>
                  <MenuItem value={2}>Width 2</MenuItem>
                  <MenuItem value={3}>Width 3</MenuItem>
                  <MenuItem value={4}>Width 4</MenuItem>
                  <MenuItem value={5}>Width 5</MenuItem>
                  <MenuItem value={6}>Width 6</MenuItem>
                  <MenuItem value={7}>Width 7</MenuItem>
                  <MenuItem value={8}>Width 8</MenuItem>
                  <MenuItem value={9}>Width 9</MenuItem>
                  <MenuItem value={10}>Width 10</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
      </Inline>
      <Divider sx={{ my: 4 }} />
      <Inline showDivider={false}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: { sm: '100%', md: '50%' }
          }}
        >
            <Stack direction="row">
                <Typography variant="subtitle1" sx={{ width: '100%' }}>Input</Typography>
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Load Example JSON" placement="top" arrow>
                            <IconButton
                                size="small"
                                onClick={() => fetchJsonData('/data/example.json', setJsonData)}
                            >
                                <VscJson/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Clear Input" placement="top" arrow>
                            <IconButton
                                size="small"
                                onClick={clearAllText}
                            >
                                <VscClearAll/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
            </Stack>
          <TextField
            multiline
            minRows={10}
            value={jsonData}
            onChange={handleChange}
            placeholder="Paste JSON here"
            fullWidth
            sx={{
               '& .MuiInputBase-root': {
                py: 1,
               },
               '& .MuiInputBase-input': {
                color: theme => alpha(theme.palette.text.primary, 0.9),
                fontSize: '0.75em',
                fontFamily: "SFMono-Regular, Menlo, Consolas, Monaco, Liberation Mono, Courier New, monospace",
               }
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: { sm: '100%', md: '50%' }
          }}
        >
          <Stack direction="row">
            <Typography variant="subtitle1" sx={{ width: '100%' }}>Output</Typography>
            <Tooltip title="Copy to Clipboard" placement="top" arrow>
                <IconButton
                size="small"
                onClick={() => navigator.clipboard.writeText(jsonData)}
                >
                    <VscChromeRestore/>
                </IconButton>
            </Tooltip>
          </Stack>
          <JsonFormatter
            data={jsonData}
            displayArrayKey={isActiveDisplayArrayKey}
            displayDataTypes={isActiveDisplayDataTypes}
            displayObjectSize={isActiveDisplayObjectSize}
            collapseStringsAfterLength={selectedLength}
            collapsed={selectedDepth}
            indentWidth={selectedIndentWidth}
          />
        </Box>
      </Inline>
    </Container>
  );
};

export default JsonExplorer;
