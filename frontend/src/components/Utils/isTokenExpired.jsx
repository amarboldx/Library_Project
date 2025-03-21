import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token) => {
    if (!token) {
        console.log('No token found');
        return true;
    }

    try {
        const decoded = jwtDecode(token);

        if (!decoded.exp) {
            console.log('No expiration found in token');
            return true;
        }

        const currentTimeSeconds = Math.floor(Date.now() / 1000);
        const expirationTimeSeconds = decoded.exp;

        return currentTimeSeconds >= expirationTimeSeconds;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
};

export default isTokenExpired;
