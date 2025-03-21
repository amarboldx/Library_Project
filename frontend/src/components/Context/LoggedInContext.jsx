import { createContext, useState, useContext, useEffect } from "react";
import isTokenExpired from "../Utils/isTokenExpired.jsx";

const LoggedInContext = createContext();

// eslint-disable-next-line react/prop-types
export const LoggedInProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const token = localStorage.getItem("jwtToken");
        return token && !isTokenExpired(token);
    });

    const login = (token) => {
        localStorage.setItem("jwtToken", token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem("jwtToken");
        setIsLoggedIn(false);
    };

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("jwtToken");
            if (!token || isTokenExpired(token)) {
                logout();
            }
        };

        checkToken();


        const interval = setInterval(checkToken, 600000);

        return () => clearInterval(interval);
    }, []);

    return (
        <LoggedInContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </LoggedInContext.Provider>
    );
};

export const useLoggedIn = () => useContext(LoggedInContext);