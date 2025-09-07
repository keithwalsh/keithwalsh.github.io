export const performJsonQuery = (jsonData: string, query: string, setJsonData: (data: string) => void): void => {
    try {
        const jsonDataObj: unknown = JSON.parse(jsonData);
        const resultData: unknown = query.split(".").reduce((obj: unknown, key: string) => {
            if (isObjectType(obj)) {
                return obj[key];
            }
            return undefined; // Return undefined if the current segment isn't an object
        }, jsonDataObj);

        if (resultData === null) {
            alert("Invalid query path.");
        } else if (typeof resultData === "object" || Array.isArray(resultData)) {
            setJsonData(JSON.stringify(resultData, null, 2));
        } else {
            alert("Result is not a JSON object.");
        }
    } catch (e) {
        alert(`Error: ${e instanceof Error ? e.message : "An unknown error occurred."}`);
    }
};

function isObjectType(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}
