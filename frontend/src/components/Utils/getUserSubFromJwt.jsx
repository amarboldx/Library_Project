import { jwtDecode } from "jwt-decode"


export const getUserSubFromJwt = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode(token);
        return decoded.sub // Split roles if they are comma-separated
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return [];
    }
};