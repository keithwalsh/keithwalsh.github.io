export const performJsonQuery = (jsonData: string, query: string, setJsonData: (data: string) => void): void => {
    try {
        const jsonDataObj: unknown = JSON.parse(jsonData);
        const resultData: unknown = query.split(".").reduce((obj: unknown, key: string) => {
            if (isObjectType(obj)) {
                return obj[key];
            }
            return undefined; // Return undefined if the current segment isn't an object
        }, jsonDataObj);

        if (resultData === undefined) {
            alert("Invalid query path.");
        } else if (resultData === null) {
            setJsonData("null");
        } else if (typeof resultData === "object" || Array.isArray(resultData)) {
            setJsonData(JSON.stringify(resultData, null, 2));
        } else {
            // Handle primitive values (string, number, boolean)
            setJsonData(JSON.stringify(resultData));
        }
    } catch (e) {
        alert(`Error: ${e instanceof Error ? e.message : "An unknown error occurred."}`);
    }
};

function isObjectType(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}
