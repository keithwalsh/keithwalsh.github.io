import { Component } from "react";
import ReactJson from "@microlink/react-json-view";
import { Box } from "@mui/material";

interface JsonFormatterProps {
    data?: string | null;
    displayArrayKey?: boolean;
    displayDataTypes?: boolean;
    displayObjectSize?: boolean;
    collapsed?: number | boolean | undefined;
    collapseStringsAfterLength?: number | false | undefined;
    indentWidth?: number;
}

class JsonFormatter extends Component<JsonFormatterProps> {
    render() {
        const { data, displayArrayKey, displayDataTypes, displayObjectSize, collapsed, collapseStringsAfterLength, indentWidth } = this.props;

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
                            fontSize: "0.75em",
                            fontFamily: "SFMono-Regular, Menlo, Consolas, Monaco, Liberation Mono, Courier New, monospace",
                        }}
                        indentWidth={indentWidth || 4}
                        enableClipboard={false}
                        displayArrayKey={displayArrayKey}
                        displayDataTypes={displayDataTypes}
                        displayObjectSize={displayObjectSize}
                        sortKeys={false}
                        collapsed={collapsed}
                        collapseStringsAfterLength={collapseStringsAfterLength}
                        quotesOnKeys={true}
                        theme={{
                            base00: "#FFFFFF", // 
                            base01: "#FFFFFF", // 
                            base02: "#353535", // Lines
                            base03: "#FFFFFF", // 
                            base04: "#fc929e", // Object Size
                            base05: "#FFFFFF", // 
                            base06: "#FFFFFF", // 
                            base07: "#F0F6FC", // Main Text
                            base08: "#FFFFFF", // 
                            base09: "#7ee787", // String
                            base0A: "#FFCB6B", // NULL
                            base0B: "#b78eff", // Float
                            base0C: "#FFFFFF", // 
                            base0D: "#9198a1", // Arrow
                            base0E: "#79c0ff", // Boolean
                            base0F: "#ff7b72", // Integer

                        }}
                    />
                </Box>
            </Box>
        );
    }
}

export default JsonFormatter;
