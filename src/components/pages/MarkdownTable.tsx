/**
 * @fileoverview Projects page component showcasing portfolio projects and
 * professional work, integrating a spreadsheet and a markdown table.
 */

import { Box, Container, Button, Snackbar, Collapse, Checkbox, FormControlLabel, IconButton, Tooltip } from "@mui/material";
import { useState, useEffect } from "react";
import Spreadsheet from 'react-spreadsheet-ts';
import { MarkdownTable } from 'react-markdown-table-ts';
import { useTheme } from '@mui/material/styles'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper 
} from '@mui/material'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import VisibilityIcon from '@mui/icons-material/Visibility'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Menu, MenuItem } from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

interface SpreadsheetRow {
    value: string;
    format: {
        bold: boolean;
        italic: boolean;
        code: boolean;
        alignment: 'left' | 'center' | 'right' | 'inherit' | 'justify';
    };
}

export function MarkdownTablePage() {
    // Original states for the spreadsheet
    const [values, setValues] = useState<string[][]>([
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', '']
    ])
    const [cellFormats, setCellFormats] = useState<SpreadsheetRow['format'][][]>(() => 
        Array(4).fill(null).map(() => 
            Array(4).fill(null).map(() => ({ 
                bold: false, 
                italic: false, 
                code: false, 
                alignment: 'left' 
            }))
        )
    )

    // New states for the markdown display
    const [markdownValues, setMarkdownValues] = useState<string[][]>([])
    const [markdownAlignments, setMarkdownAlignments] = useState<('left' | 'center' | 'right')[]>([])

    const [showMarkdown, setShowMarkdown] = useState(true)
    const [showHtml, setShowHtml] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState(false)

    const theme = useTheme()

    const [currentMarkdown, setCurrentMarkdown] = useState<string>('')
    const [isGenerating, setIsGenerating] = useState(false)

    const [isAnimatingPreview, setIsAnimatingPreview] = useState(false)

    const [isCompact, setIsCompact] = useState(false)
    const [hasTabs, setHasTabs] = useState(false)
    const [convertLineBreaks, setConvertLineBreaks] = useState(false)
    const [hasPadding, setHasPadding] = useState(true)

    const [isCopied, setIsCopied] = useState(false)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    
    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    useEffect(() => {
        setMarkdownValues([...values])
        setMarkdownAlignments(getColumnAlignments())
    }, [])

    const handleFormatChange = (row: number, col: number, format: SpreadsheetRow['format']) => {
        setCellFormats(prev => {
            const newFormats = prev.map(row => [...row])
            newFormats[row][col] = { ...format }
            return newFormats
        })
    }

    const getColumnAlignments = () => {
        if (cellFormats.length === 0) return []
        
        const alignments = cellFormats[0].map((_, colIndex) => {
            for (let rowIndex = 0; rowIndex < cellFormats.length; rowIndex++) {
                const alignment = cellFormats[rowIndex][colIndex].alignment
                if (alignment !== 'left') {
                    return (alignment === 'inherit' || alignment === 'justify') ? 'left' : alignment
                }
            }
            return 'left'
        })
        
        return alignments as ('left' | 'center' | 'right')[]
    }

    const handleGenerateMarkdown = () => {
        setIsGenerating(true)
        
        // Check if there are any changes in values or alignments
        const valuesEqual = JSON.stringify(markdownValues) === JSON.stringify(values)
        const currentAlignments = getColumnAlignments()
        const alignmentsEqual = JSON.stringify(markdownAlignments) === JSON.stringify(currentAlignments)
        
        if (valuesEqual && alignmentsEqual) {
            setShowSnackbar(true)
        } else {
            // Capture current spreadsheet state
            setMarkdownValues([...values])
            setMarkdownAlignments(currentAlignments)
            setShowMarkdown(true)
        }
        
        setTimeout(() => setIsGenerating(false), 500)
    }

    const handlePreviewToggle = () => {
        setIsAnimatingPreview(true)
        setShowHtml(prev => !prev)
        setTimeout(() => setIsAnimatingPreview(false), 300)
    }

    const handleCompactToggle = () => {
        setIsCompact(prev => !prev)
    }

    const handleTabsToggle = () => {
        setHasTabs(prev => !prev)
    }

    const handleNewlinesToggle = () => {
        setConvertLineBreaks(prev => !prev)
    }

    const handlePaddingToggle = () => {
        setHasPadding(prev => !prev)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(currentMarkdown)
            .then(() => {
                setIsCopied(true)
                setTimeout(() => setIsCopied(false), 5000)
            })
            .catch(console.error)
    }

    const handleDownload = () => {
        const blob = new Blob([currentMarkdown], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'markdown_table.txt'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    return (
        <Container maxWidth="lg">
            <Box>
                <Box>
                    <Spreadsheet
                        toolbarOrientation="horizontal"
                        initialRows={4}
                        initialColumns={4}
                        tableHeight="220px"
                        value={values}
                        onChange={setValues}
                        onFormatChange={handleFormatChange}
                    />
                </Box>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Button 
                            variant="contained" 
                            onClick={handleGenerateMarkdown}
                            size="small"
                            startIcon={
                                <AutorenewIcon 
                                    sx={{
                                        animation: isGenerating ? 'spin 0.5s linear' : 'none',
                                        '@keyframes spin': {
                                            '0%': {
                                                transform: 'rotate(0deg)',
                                            },
                                            '100%': {
                                                transform: 'rotate(360deg)',
                                            },
                                        },
                                    }}
                                />
                            }
                        >
                            Generate Markdown
                        </Button>
                        {showMarkdown && (
                            <>
                                <Button 
                                    variant="outlined" 
                                    onClick={handlePreviewToggle}
                                    size="small"
                                    startIcon={
                                        <VisibilityIcon 
                                            sx={{
                                                animation: isAnimatingPreview ? 'previewPulse 0.3s ease-in-out' : 'none',
                                                '@keyframes previewPulse': {
                                                    '0%': {
                                                        transform: 'scale(1)',
                                                    },
                                                    '50%': {
                                                        transform: 'scale(1.2)',
                                                    },
                                                    '100%': {
                                                        transform: 'scale(1)',
                                                    },
                                                },
                                            }}
                                        />
                                    }
                                    endIcon={showHtml ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                >
                                    HTML PREVIEW
                                </Button>
                            </>
                        )}
                    </Box>
                    
                    {showMarkdown && (
                        <>
                            <Collapse 
                                in={showHtml} 
                                timeout={400}
                                sx={{
                                    transformOrigin: 'top',
                                    '& .MuiCollapse-wrapperInner': {
                                        transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
                                        transform: showHtml ? 'translateY(0)' : 'translateY(-20px)',
                                    }
                                }}
                            >
                                <Box 
                                    sx={{ 
                                        mb: 2,
                                        px: 2,
                                        pl: 0,
                                        py: 2,
                                        bgcolor: 'background.paper', 
                                        borderRadius: 1,
                                        overflow: 'auto'
                                    }}
                                >
                                    <TableContainer 
                                        component={Paper}
                                        sx={{ 
                                            width: '100%',
                                            '& table': {
                                                width: '100%',
                                                tableLayout: 'fixed'
                                            }
                                        }}
                                    >
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                table: ({ children }) => (
                                                    <Table size="small">
                                                        {children}
                                                    </Table>
                                                ),
                                                thead: ({ children }) => (
                                                    <TableHead>
                                                        {children}
                                                    </TableHead>
                                                ),
                                                tbody: ({ children }) => (
                                                    <TableBody>
                                                        {children}
                                                    </TableBody>
                                                ),
                                                tr: ({ children }) => (
                                                    <TableRow>
                                                        {children}
                                                    </TableRow>
                                                ),
                                                th: ({ children, style }) => (
                                                    <TableCell
                                                        component="th"
                                                        align={style?.textAlign as 'left' | 'center' | 'right' | undefined}
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            bgcolor: 'action.hover',
                                                            borderRight: 1,
                                                            borderColor: 'divider',
                                                            '&:last-child': {
                                                                borderRight: 0
                                                            }
                                                        }}
                                                    >
                                                        {children}
                                                    </TableCell>
                                                ),
                                                td: ({ children, style }) => (
                                                    <TableCell 
                                                        align={style?.textAlign as 'left' | 'center' | 'right' | undefined}
                                                        sx={{
                                                            borderRight: 1,
                                                            borderColor: 'divider',
                                                            '&:last-child': {
                                                                borderRight: 0
                                                            }
                                                        }}
                                                    >
                                                        {children}
                                                    </TableCell>
                                                )
                                            }}
                                        >
                                            {currentMarkdown}
                                        </ReactMarkdown>
                                    </TableContainer>
                                </Box>
                            </Collapse>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ position: 'relative' }}>
                                    <Box sx={{ position: 'absolute', top: 14, right: 8, zIndex: 1, display: 'flex', gap: 0.5 }}>
                                        <Tooltip
                                            title={isCopied ? 'Copied!' : 'Copy markdown table syntax'}
                                            placement="left-end"
                                            arrow
                                            TransitionProps={{ enter: true, exit: false }}
                                        >
                                            <IconButton 
                                                onClick={handleCopy}
                                                size="small"
                                                sx={{
                                                    '&:hover': {
                                                        bgcolor: 'action.hover'
                                                    },
                                                    '& .MuiSvgIcon-root': {
                                                        animation: isCopied ? 'copyPulse 0.3s ease-in-out' : 'none',
                                                        '@keyframes copyPulse': {
                                                            '0%': { transform: 'scale(1)' },
                                                            '50%': { transform: 'scale(0.8)' },
                                                            '100%': { transform: 'scale(1)' },
                                                        },
                                                    }
                                                }}
                                            >
                                                <ContentCopyIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Download markdown table" placement="left-end" arrow>
                                            <IconButton
                                                onClick={handleDownload}
                                                size="small"
                                                sx={{
                                                    '&:hover': {
                                                        bgcolor: 'action.hover'
                                                    }
                                                }}
                                            >
                                                <FileDownloadIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Table options" placement="left-end" arrow>
                                            <IconButton
                                                size="small"
                                                onClick={handleMenuClick}
                                                sx={{
                                                    '&:hover': {
                                                        bgcolor: 'action.hover'
                                                    }
                                                }}
                                            >
                                                <MoreVertIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleMenuClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                    >
                                        <MenuItem>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        size="small"
                                                        checked={isCompact}
                                                        onChange={handleCompactToggle}
                                                    />
                                                }
                                                label="Minimize whitespace between cells"
                                            />
                                        </MenuItem>
                                        <MenuItem>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        size="small"
                                                        checked={hasTabs}
                                                        onChange={handleTabsToggle}
                                                    />
                                                }
                                                label="Use tabs instead of spaces"
                                            />
                                        </MenuItem>
                                        <MenuItem>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        size="small"
                                                        checked={convertLineBreaks}
                                                        onChange={handleNewlinesToggle}
                                                    />
                                                }
                                                label="Convert line breaks to HTML"
                                            />
                                        </MenuItem>
                                        <MenuItem>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        size="small"
                                                        checked={hasPadding}
                                                        onChange={handlePaddingToggle}
                                                    />
                                                }
                                                label="Add padding around content"
                                            />
                                        </MenuItem>
                                    </Menu>
                                    <MarkdownTable
                                        inputData={markdownValues}
                                        columnAlignments={markdownAlignments}
                                        hasHeader={true}
                                        isCompact={isCompact}
                                        hasTabs={hasTabs}
                                        convertLineBreaks={convertLineBreaks}
                                        hasPadding={hasPadding}
                                        theme={theme.palette.mode}
                                        onGenerate={setCurrentMarkdown}
                                        preStyle={{
                                            borderRadius: '8px',
                                            overflow: 'hidden'
                                        }}
                                    />
                                </Box>
                            </Box>

                            <Snackbar
                                open={showSnackbar}
                                autoHideDuration={3000}
                                onClose={() => setShowSnackbar(false)}
                                message="No changes detected in the table"
                            />
                        </>
                    )}
                </Box>
            </Box>
        </Container>
    );
}
