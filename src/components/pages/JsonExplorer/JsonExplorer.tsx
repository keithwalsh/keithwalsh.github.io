import React, { useState } from 'react';
import { VscJson, VscClearAll, VscChromeRestore } from 'react-icons/vsc';
import { JsonFormatter } from './components';
import { useToggle, fetchJsonData, performJsonQuery } from './utils';
import { TextField, Box, Divider, Typography, IconButton, Tooltip, Stack, alpha } from '@mui/material';
import { LinInline, LinInstructionsCard, LinSearch, LinSelect, LinSwitch } from '../../shared-components';

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
    <Box sx={{ 
      flex: 1,
      padding: 3,
      transition: 'all 0.5s ease-in-out',
      mt: 4
  }}>
      <LinInline showDivider={false}>
        <LinInstructionsCard
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
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <LinSearch
              label="JSON Path Input"
              placeholder="Enter JSON dot notation e.g. user.name"
              value={query}
              onChange={handleQueryChange}
              onClick={handlePerformQuery}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <Stack direction="row" spacing={{ xs: 2.5, sm: 3, md: 2, lg: 5}}>
              <LinSwitch
                label="Array Keys"
                checked={isActiveDisplayArrayKey}
                onChange={handleToggleDisplayArrayKey}
              />
              <LinSwitch
                label="Data Types"
                checked={isActiveDisplayDataTypes}
                onChange={handleToggleDisplayDataTypes}
              />
              <LinSwitch
                label="Object Size"
                checked={isActiveDisplayObjectSize}
                onChange={handleToggleDisplayObjectSize}
              />
            </Stack>
            <Stack direction="row" spacing= {{ xs: 1, sm: 2, md: 1, lg: 3}}>
              <LinSelect
                label="Collapse"
                values={[
                  { value: '', label: 'Expand All' },
                  { value: 'collapse-all', label: 'Collapse All' },
                  { value: 1, label: 'Depth 1' },
                  { value: 2, label: 'Depth 2' },
                  { value: 3, label: 'Depth 3' }
                ]}
                selectedValue={selectedDepth === true ? 'collapse-all' : (selectedDepth === false ? '' : selectedDepth)}
                onChange={(value) => {
                  if (value === 'collapse-all') {
                    setSelectedDepth(true);
                  } else {
                    setSelectedDepth(Number(value) || false);
                  }
                }}
              />
              <LinSelect
                label="String Limit"
                values={[
                  { value: '', label: 'No Limit' },
                  { value: 20, label: 'Length 20' },
                  { value: 40, label: 'Length 40' },
                  { value: 50, label: 'Length 50' },
                  { value: 100, label: 'Length 100' }
                ]}
                selectedValue={selectedLength === false ? '' : selectedLength}
                onChange={(value) => setSelectedLength(Number(value) || false)}
              />
              <LinSelect
                label="Indent Width"
                values={[
                  { value: '', label: 'Default (4)' },
                  { value: 1, label: 'Width 1' },
                  { value: 2, label: 'Width 2' },
                  { value: 3, label: 'Width 3' },
                  { value: 4, label: 'Width 4' },
                  { value: 5, label: 'Width 5' },
                  { value: 6, label: 'Width 6' },
                  { value: 7, label: 'Width 7' },
                  { value: 8, label: 'Width 8' },
                  { value: 9, label: 'Width 9' },
                  { value: 10, label: 'Width 10' }
                ]}
                selectedValue={selectedIndentWidth === 4 ? '' : selectedIndentWidth}
                onChange={(value) => {
                  if (value === '') {
                    setSelectedIndentWidth(4);
                  } else {
                    const num = Number(value);
                    setSelectedIndentWidth(isNaN(num) ? 4 : num);
                  }
                }}
              />
            </Stack>
          </Box>
        </Box>
      </LinInline>
      <Divider sx={{ my: { xs: 2, sm: 3 } }} />
      <LinInline showDivider={false}>
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
            slotProps={{
              input: {
                autoComplete: 'off',
                autoCorrect: 'off',
                autoCapitalize: 'off',
                spellCheck: false,
              },
            }}
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
      </LinInline>
    </Box>
  );  
};

export default JsonExplorer;
