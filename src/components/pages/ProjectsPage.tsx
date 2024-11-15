/**
 * @fileoverview Projects page component showcasing portfolio projects and
 * professional work.
 */

import { Box, Container, Typography } from "@mui/material";
import Spreadsheet from 'react-spreadsheet-ts'

import { useState } from "react"

interface SpreadsheetRow {
    value: string
    format: {
        bold: boolean
        italic: boolean
        code: boolean
        alignment: 'left' | 'center' | 'right'
    }
}

export function ProjectsPage() {
    const [spreadsheetData, setSpreadsheetData] = useState<SpreadsheetRow[][]>([
        [
            { value: 'Project Name', format: { bold: true, alignment: 'center', italic: false, code: false } },
            { value: 'Description', format: { bold: true, alignment: 'center', italic: false, code: false } },
            { value: 'Technologies', format: { bold: true, alignment: 'center', italic: false, code: false } },
            { value: 'Status', format: { bold: true, alignment: 'center', italic: false, code: false } }
        ],
        [
            { value: 'Portfolio Website', format: { bold: false, italic: false, code: false, alignment: 'left' } },
            { value: 'Personal portfolio and blog', format: { bold: false, italic: false, code: false, alignment: 'left' } },
            { value: 'React, TypeScript, MUI', format: { bold: false, italic: false, code: false, alignment: 'left' } },
            { value: 'Completed', format: { bold: true, italic: false, code: false, alignment: 'left' } }
        ],
        [
            { value: 'Task Manager', format: { bold: false, italic: false, code: false, alignment: 'left' } },
            { value: 'Project management application', format: { bold: false, italic: false, code: false, alignment: 'left' } },
            { value: 'Node.js, Express, MongoDB', format: { bold: false, italic: false, code: false, alignment: 'left' } },
            { value: 'In Progress', format: { italic: true, bold: false, code: false, alignment: 'left' } }
        ],
        [
            { value: 'Weather App', format: { bold: false, italic: false, code: false, alignment: 'left' } },
            { value: 'Real-time weather dashboard', format: { bold: false, italic: false, code: false, alignment: 'left' } },
            { value: 'React, Redux, OpenWeather API', format: { bold: false, italic: false, code: false, alignment: 'left' } },
            { value: 'Planning', format: { italic: true, bold: false, code: false, alignment: 'left' } }
        ]
    ])

    const stringData = spreadsheetData.map(row => 
        row.map(cell => cell.value)
    )

    const handleSpreadsheetChange = (newData: string[][]) => {
        const formattedData = newData.map((row, rowIndex) =>
            row.map((value, colIndex) => ({
                value,
                format: spreadsheetData[rowIndex]?.[colIndex]?.format || {
                    bold: false,
                    italic: false,
                    code: false,
                    alignment: 'left'
                }
            }))
        )
        setSpreadsheetData(formattedData)
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Projects
                </Typography>
                <Spreadsheet
                    toolbarOrientation="horizontal"
                    initialRows={4}
                    initialColumns={10}
                    tableHeight="250px"
                    value={stringData}
                    onChange={handleSpreadsheetChange}
                />
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Spreadsheet Data:
                    </Typography>
                    <pre>
                        {JSON.stringify(spreadsheetData, null, 2)}
                    </pre>
                </Box>
                <Typography variant="body1">
                    Here you'll find a collection of my projects and professional work.
                </Typography>
            </Box>
        </Container>
    )
}
