import { jwtDecode } from "jwt-decode"


export const getUserRoleFromJwt = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode(token);
        return decoded.roles ? decoded.roles.split(",") : []; // Split roles if they are comma-separated
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return [];
    }
};