import axios from "axios";
import { notification } from "antd";
import { API_BASE_URL } from "../Config/src.jsx";

const useAddToCart = (token, cartBooks, setCartBooks) => {
    const addToCart = async (bookId, quantity = 1) => {
        if (!bookId) {
            notification.error({
                message: "Invalid Book ID",
                description: "The Book ID is missing or invalid.",
                placement: "topRight",
            });
            return;
        }

        if (cartBooks.has(bookId)) {
            notification.warning({
                message: "Already in Cart",
                description: "This book is already in your cart.",
                placement: "topRight",
            });
            return;
        }

        const url = `${API_BASE_URL}/api/books/add-to-cart/${bookId}/${quantity}`;

        try {
            await axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });

            // Update cartBooks state by adding the book only if it's not already present
            setCartBooks((prev) => {
                const updated = new Map(prev);
                updated.set(bookId, { quantity });
                console.log(updated);
                return updated;
            });

            notification.success({
                message: "Added to Cart",
                description: "Successfully added to your cart.",
                placement: "topRight",
            });
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                const errorMessages = {
                    400: ["Not Enough Stock", `Could not add the book to the cart. ${data}`],
                    401: ["Please Log In", "You need to log in to add the book to your cart."],
                };

                const [title, desc] = errorMessages[status] || ["Error", "Could not update the cart. Please try again."];

                notification.error({ message: title, description: desc, placement: "topRight" });
            } else {
                console.error("Error updating cart:", error);
                notification.error({
                    message: "Network Error",
                    description: "There was an issue connecting to the server. Please try again later.",
                    placement: "topRight",
                });
            }
        }
    };

    return { addToCart };
};

export default useAddToCart;
