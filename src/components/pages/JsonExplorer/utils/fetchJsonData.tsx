/**
 * Fetches JSON data from a specified URL and updates the provided state setter function.
 *
 * @param url The URL from which to fetch data.
 * @param setJsonData The state setter function to update with the fetched data.
 */
const fetchJsonData = async (
    url: string,
    setJsonData: React.Dispatch<React.SetStateAction<string>>
): Promise<void> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setJsonData(JSON.stringify(data, null, 4)); // Pretty print the JSON
    } catch (error) {
        console.error("Failed to load JSON data:", error);
        setJsonData(
            `Error loading data: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
};

export default fetchJsonData;
