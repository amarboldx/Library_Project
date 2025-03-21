import { useState, useEffect } from "react";
import axios from "axios";
import { notification } from "antd";

const useFetchBooks = (API_BASE_URL) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/books/get/all`)
            .then((response) => {
                setBooks(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching books:", error);
                setLoading(false);
                notification.error({
                    message: 'Error',
                    description: 'Could not load books. Please try again.',
                    placement: 'topRight',
                });
            });
    }, [API_BASE_URL]);

    return { books, loading };
};

export default useFetchBooks;