/**
 * @fileoverview Projects page component showcasing portfolio projects and
 * professional work, integrating a spreadsheet and a markdown table.
 */

import { Box, Container, Typography, Button, Snackbar, Collapse, Checkbox, FormControlLabel } from "@mui/material";
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
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import VisibilityIcon from '@mui/icons-material/Visibility'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

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
    const [cellFormats, setCellFormats] = useState<SpreadsheetRow['format'][][]>(
        Array(4).fill(Array(4).fill({ bold: false, italic: false, code: false, alignment: 'none' }))
    )

    // New states for the markdown display
    const [markdownValues, setMarkdownValues] = useState<string[][]>([])
    const [markdownAlignments, setMarkdownAlignments] = useState<('left' | 'center' | 'right' | 'none')[]>([])

    const [showMarkdown, setShowMarkdown] = useState(true)
    const [showHtml, setShowHtml] = useState(false)
    const [showSnackbar, setShowSnackbar] = useState(false)

    const theme = useTheme()

    const [currentMarkdown, setCurrentMarkdown] = useState<string>('')
    const [isGenerating, setIsGenerating] = useState(false)

    const [snackbarMessage, setSnackbarMessage] = useState("Markdown copied to clipboard")

    const [isCopying, setIsCopying] = useState(false)

    const [isAnimatingPreview, setIsAnimatingPreview] = useState(false)

    const [isCompact, setIsCompact] = useState(false)
    const [hasTabs, setHasTabs] = useState(false)
    const [canReplaceNewlines, setCanReplaceNewlines] = useState(false)
    const [hasPadding, setHasPadding] = useState(true)

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
        
        return cellFormats[0].map(format => {
            const alignment = format.alignment
            return (alignment === 'inherit' || alignment === 'justify') ? 'left' : alignment
        }) as ('left' | 'center' | 'right' | 'none')[]
    }

    const handleGenerateMarkdown = () => {
        setIsGenerating(true)
        
        // Check if there are any changes by comparing current and new values
        const isEqual = JSON.stringify(markdownValues) === JSON.stringify(values)
        
        if (isEqual) {
            setShowSnackbar(true)
            setSnackbarMessage("No changes detected")
        } else {
            // Capture current spreadsheet state
            setMarkdownValues([...values])
            setMarkdownAlignments(getColumnAlignments())
            setShowMarkdown(true)
        }
        
        // Reset the animation after 500ms
        setTimeout(() => setIsGenerating(false), 500)
    }

    // Update the copy function to use the ref
    const handleCopyMarkdown = async () => {
        setIsCopying(true)
        await navigator.clipboard.writeText(currentMarkdown)
        setShowSnackbar(true)
        // Reset the animation after 200ms
        setTimeout(() => setIsCopying(false), 200)
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
        setCanReplaceNewlines(prev => !prev)
    }

    const handlePaddingToggle = () => {
        setHasPadding(prev => !prev)
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
                        <Typography variant="h6">
                            Markdown Table:
                        </Typography>
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
                                    onClick={handleCopyMarkdown}
                                    size="small"
                                    startIcon={
                                        <ContentCopyIcon 
                                            sx={{
                                                animation: isCopying ? 'copyPulse 0.2s ease-in-out' : 'none',
                                                '@keyframes copyPulse': {
                                                    '0%': {
                                                        transform: 'scale(1)',
                                                    },
                                                    '50%': {
                                                        transform: 'scale(0.8)',
                                                    },
                                                    '100%': {
                                                        transform: 'scale(1)',
                                                    },
                                                },
                                            }}
                                        />
                                    }
                                >
                                    Copy Markdown
                                </Button>
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
                                                th: ({ children }) => (
                                                    <TableCell
                                                        component="th"
                                                        align="left"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            bgcolor: 'action.hover'
                                                        }}
                                                    >
                                                        {children}
                                                    </TableCell>
                                                ),
                                                td: ({ children }) => (
                                                    <TableCell align="left">
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
                                <MarkdownTable
                                    inputData={markdownValues}
                                    columnAlignments={markdownAlignments}
                                    hasHeader={true}
                                    isCompact={isCompact}
                                    hasTabs={hasTabs}
                                    canReplaceNewlines={canReplaceNewlines}
                                    hasPadding={hasPadding}
                                    theme={theme.palette.mode}
                                    onTableCreate={setCurrentMarkdown}
                                />
                                
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                }}>
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
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={hasTabs}
                                                onChange={handleTabsToggle}
                                            />
                                        }
                                        label="Use tabs instead of spaces between columns"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={canReplaceNewlines}
                                                onChange={handleNewlinesToggle}
                                            />
                                        }
                                        label="Convert line breaks to HTML <br> tags"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={hasPadding}
                                                onChange={handlePaddingToggle}
                                            />
                                        }
                                        label="Add padding spaces around cell content"
                                    />
                                </Box>
                            </Box>

                            <Snackbar
                                open={showSnackbar}
                                autoHideDuration={3000}
                                onClose={() => setShowSnackbar(false)}
                                message={snackbarMessage}
                            />
                        </>
                    )}
                </Box>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Here you'll find a collection of my projects and professional work.
                </Typography>
            </Box>
        </Container>
    );
}
