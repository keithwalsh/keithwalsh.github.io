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
                        backgroundColor: "#2b3440",
                        color: "#d7dde4",
                        border: "1px solid #D8E3E4",
                    }}
                >
                    <ReactJson
                        src={safeParseJson(data)}
                        name={false}
                        style={{
                            padding: 10,
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
                            base00: "#212121",
                            base01: "#303030",
                            base02: "#353535",
                            base03: "#4A4A4A",
                            base04: "#B2CCD6",
                            base05: "#EEFFFF",
                            base06: "#EEFFFF",
                            base07: "#FFFFFF",
                            base08: "#F07178",
                            base09: "#F78C6C",
                            base0A: "#FFCB6B",
                            base0B: "#C3E88D",
                            base0C: "#89DDFF",
                            base0D: "#82AAFF",
                            base0E: "#C792EA",
                            base0F: "#FF5370",
                        }}
                    />
                </Box>
            </Box>
        );
    }
}

export default JsonFormatter;
