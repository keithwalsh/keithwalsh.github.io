import { useState, useCallback } from "react";

/**
 * A hook to handle toggle states.
 *
 * @param initialState The initial state of the toggle.
 * @returns A tuple with the current state and a function to toggle the state.
 */
const useToggle = (initialState: boolean = false): [boolean, () => void] => {
    const [isActive, setIsActive] = useState<boolean>(initialState);

    // Define a function that toggles the state
    const toggle = useCallback(() => {
        setIsActive((currentState) => !currentState);
    }, []);

    return [isActive, toggle];
};

export default useToggle;
