import { Component } from "react";
import ReactJson from "@microlink/react-json-view";
import { Box } from "@mui/material";

interface JsonFormatterProps {
    data?: string | null;
    displayDataTypes?: boolean | false;
    displayObjectSize?: boolean | false;
    collapsed?: number | false | undefined;
    collapseStringsAfterLength?: number | false | undefined;
}

class JsonFormatter extends Component<JsonFormatterProps> {
    render() {
        const { data, displayDataTypes, displayObjectSize, collapsed, collapseStringsAfterLength } = this.props;

        // Function to safely parse JSON and handle exceptions
        const safeParseJson = (jsonString?: string | null) => {
            if (jsonString === undefined || jsonString === null) {
                return {}; // Return empty object if input is undefined or null
            }
            try {
                return JSON.parse(jsonString); // Attempt to parse jsonString
            } catch {
                return {}; // Return empty object on parsing error
            }
        };

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: "100%" }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: "100%",
                        overflowY: "auto",
                        overflowX: "auto",
                        minWidth: "18rem",
                        borderRadius: 1,
                        backgroundColor: "#0d1117",
                        color: "#d7dde4",
                        border: "1px solid rgba(61, 68, 77, 1)",
                    }}
                >
                    <ReactJson
                        src={safeParseJson(data)}
                        name={false}
                        style={{
                            paddingTop: 10,
                            paddingBottom: 10,
                            paddingLeft: 5,
                            paddingRight: 10,
                            height: "100%",
                            backgroundColor: "none",
                            fontSize: "12px",
                            fontFamily: "SFMono-Regular, Menlo, Consolas, Monaco, Liberation Mono, Courier New, monospace",
                        }}
                        indentWidth={4}
                        enableClipboard={false}
                        displayDataTypes={displayDataTypes}
                        displayObjectSize={displayObjectSize}
                        sortKeys={true}
                        collapsed={collapsed}
                        collapseStringsAfterLength={collapseStringsAfterLength}
                        quotesOnKeys={false}
                        theme={{
                            base00: "#FFFFFF", // 
                            base01: "#FFFFFF", // 
                            base02: "#353535", // Lines
                            base03: "#FFFFFF", // 
                            base04: "#FFFFFF", // 
                            base05: "#FFFFFF", // 
                            base06: "#FFFFFF", // 
                            base07: "#F0F6FC", // Main Text
                            base08: "#FFFFFF", // 
                            base09: "#7ee787", // String
                            base0A: "#FFCB6B", // NULL
                            base0B: "#FFFFFF", // 
                            base0C: "#FFFFFF", // 
                            base0D: "#9198a1", // 
                            base0E: "#79c0ff", // Binary
                            base0F: "#ff7b72", // Number

                        }}
                    />
                </Box>
            </Box>
        );
    }
}

export default JsonFormatter;
