import { useState, useEffect } from "react";
import axios from "axios";
import { notification } from "antd";

const useFetchLikedBooks = (API_BASE_URL, token) => {
    const [likedBooks, setLikedBooks] = useState(new Set());

    useEffect(() => {
        if (token) {
            axios.get(`${API_BASE_URL}/api/books/likedBooks`, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': "application/json" },
            })
                .then((response) => {
                    const likedBooksSet = new Set(response.data.map((book) => book.id));
                    setLikedBooks(likedBooksSet);
                })
                .catch((error) => {
                    console.error("Error fetching liked books:", error);
                    notification.error({
                        message: 'Error',
                        description: 'Could not fetch liked books. Please try again.',
                        placement: 'topRight',
                    });
                });
        }
    }, [API_BASE_URL, token]);

    return { likedBooks, setLikedBooks };
};

export default useFetchLikedBooks;