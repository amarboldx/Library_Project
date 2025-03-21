import axios from "axios";
import { notification } from "antd";

const useUpdateCartQuantity = (API_BASE_URL, token, cartBooks, setCartBooks) => {
    const updateQuantity = (bookId, quantity) => {
        if (quantity < 0) return;

        const updatedCartBooks = new Map(cartBooks);

        if (updatedCartBooks.has(bookId)) {
            const item = updatedCartBooks.get(bookId);
            const currentQuantity = item.quantity;

            // Update quantity
            item.quantity = quantity;

            updatedCartBooks.set(bookId, item);
            setCartBooks(updatedCartBooks);
            if (quantity === 0) {
                updatedCartBooks.delete(bookId);

                axios.put(`${API_BASE_URL}/api/books/remove-from-cart/${bookId}/${item.quantity}`, null, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                    .catch((error) => {
                        console.error("Error removing from cart:", error);
                        notification.error({
                            message: 'Error',
                            description: 'Could not update the cart. Please try again.',
                            placement: 'topRight',
                        });
                    });
            }

            if (quantity > currentQuantity) {
                axios.put(`${API_BASE_URL}/api/books/add-to-cart/${bookId}/${quantity - currentQuantity}`, null, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                    .catch((error) => {
                        console.error("Error adding to cart:", error);
                        notification.error({
                            message: 'Error',
                            description: 'Could not update the cart. Please try again.',
                            placement: 'topRight',
                        });
                    });
            } else if (quantity < currentQuantity) {
                axios.put(`${API_BASE_URL}/api/books/remove-from-cart/${bookId}/${currentQuantity - quantity}`, null, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                    .catch((error) => {
                        console.error("Error removing from cart:", error);
                        notification.error({
                            message: 'Error',
                            description: 'Could not update the cart. Please try again.',
                            placement: 'topRight',
                        });
                    });
            }
        }
    };

    return { updateQuantity };
};

export default useUpdateCartQuantity;
