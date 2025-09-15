export const performJsonQuery = (jsonData: string, query: string, setJsonData: (data: string) => void): void => {
    try {
        // Check if jsonData is empty
        if (!jsonData.trim()) {
            setJsonData(JSON.stringify({ error: "No JSON data provided" }, null, 2));
            return;
        }

        const jsonDataObj: unknown = JSON.parse(jsonData);
        
        // Handle empty query - return the root object
        if (!query.trim()) {
            setJsonData(JSON.stringify(jsonDataObj, null, 2));
            return;
        }
        
        const resultData: unknown = query.split(".").reduce((obj: unknown, key: string) => {
            if (isObjectType(obj)) {
                return obj[key];
            }
            return undefined; // Return undefined if the current segment isn't an object
        }, jsonDataObj);

        if (resultData === undefined) {
            setJsonData(JSON.stringify({ error: "Invalid query path" }, null, 2));
        } else if (resultData === null) {
            setJsonData(JSON.stringify({ result: null }, null, 2));
        } else if (typeof resultData === "object" || Array.isArray(resultData)) {
            setJsonData(JSON.stringify(resultData, null, 2));
        } else {
            // Handle primitive values (string, number, boolean) - wrap in object for proper display
            setJsonData(JSON.stringify({ result: resultData }, null, 2));
        }
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        setJsonData(JSON.stringify({ error: `JSON parsing error: ${errorMessage}` }, null, 2));
    }
};

function isObjectType(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}
