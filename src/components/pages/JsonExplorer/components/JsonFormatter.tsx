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
                            base00: "#FFFFFF", // very dark gray
                            base01: "#FFFFFF", // dark gray
                            base02: "#353535", // charcoal gray
                            base03: "#4A4A4A", // medium gray
                            base04: "#B2CCD6", // pale blue
                            base05: "#EEFFFF", // very light blue
                            base06: "#EEFFFF", // very light blue
                            base07: "#F0F6FC", // white
                            base08: "#F07178", // light red
                            base09: "#7ee787", // Text
                            base0A: "#FFCB6B", // yellow
                            base0B: "#C3E88D", // light green
                            base0C: "#89DDFF", // sky blue
                            base0D: "#82AAFF", // light blue
                            base0E: "#C792EA", // lavender
                            base0F: "#79c0ff", // Number
                        }}
                    />
                </Box>
            </Box>
        );
    }
}

export default JsonFormatter;
