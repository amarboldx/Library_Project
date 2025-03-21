import { useState, useEffect } from "react";
import axios from "axios";
import { notification } from "antd";

const useFetchCartItems = (API_BASE_URL, token) => {
    const [cartBooks, setCartBooks] = useState(new Map());

    useEffect(() => {
        if (token) {
            axios.get(`${API_BASE_URL}/api/books/cart`, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': "application/json" },
            })
                .then((response) => {
                    const cartMap = new Map();
                    response.data.forEach((item) => {
                        const { book, quantity } = item;
                        cartMap.set(book.id, { ...book, quantity });
                    });
                    setCartBooks(cartMap);
                })
                .catch((error) => {
                    console.error("Error fetching cart items:", error);
                    notification.error({
                        message: 'Error',
                        description: 'Could not fetch cart items. Please try again.',
                        placement: 'topRight',
                    });
                });
        }
    }, [API_BASE_URL, token]);

    return { cartBooks, setCartBooks };
};

export default useFetchCartItems;