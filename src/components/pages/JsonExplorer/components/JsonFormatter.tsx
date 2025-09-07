import { Component } from "react";
import ReactJson from "@microlink/react-json-view";

interface JsonFormatterProps {
    label?: string;
    className?: string;
    data?: string | null;
    displayDataTypes?: boolean | false;
    displayObjectSize?: boolean | false;
    collapsed?: number | false | undefined;
    collapseStringsAfterLength?: number | false | undefined;
}

class JsonFormatter extends Component<JsonFormatterProps> {
    render() {
        const { label, className, data, displayDataTypes, displayObjectSize, collapsed, collapseStringsAfterLength } = this.props;

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
            <div className={className}>
                <label htmlFor="textarea" className="block font-roboto text-xs text-textColor font-normal tracking-wider uppercase mb-1">
                    {label}
                </label>
                <div className="p-5 relative overflow-y-auto overflow-x-auto min-w-[18rem] h-[35.45rem] rounded-4px bg-[#2b3440] text-[#d7dde4] border border-borderColor">
                    <ReactJson
                        src={safeParseJson(data)}
                        name={false}
                        style={{
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
                </div>
            </div>
        );
    }
}

export default JsonFormatter;
