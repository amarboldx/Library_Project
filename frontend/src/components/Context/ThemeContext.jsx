import { createContext, useState } from "react";

// Create a context for the theme
export const ThemeContext = createContext();

// Theme provider component
// eslint-disable-next-line react/prop-types
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};