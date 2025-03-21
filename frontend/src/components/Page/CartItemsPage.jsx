import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Spin, notification } from "antd";
import { ThemeContext } from "../Context/ThemeContext.jsx";
import { useLoggedIn } from "../Context/LoggedInContext.jsx";
import { ShoppingCartOutlined } from "@ant-design/icons";
import useToggleLike from "../Hooks/useToggleLike.jsx";
import useAddToCart from "../Hooks/useAddToCart.jsx";
import { API_BASE_URL } from "../Config/src.jsx";
import BookList from "../Hooks/BookList.jsx";
import useUpdateCartQuantity from "../Hooks/useUpdateCartQuantity.jsx";
import useFetchLikedBooks from "../Hooks/useFetchLikedBooks.jsx";  // Import the custom hook

const CartItemsPage = () => {
    const { isLoggedIn } = useLoggedIn();
    const [cartBooks, setCartBooks] = useState(new Map());
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useContext(ThemeContext);
    const token = localStorage.getItem('jwtToken');
    const { addToCart } = useAddToCart(token, cartBooks, setCartBooks);

    // Use the custom hook for fetching liked books
    const { likedBooks, setLikedBooks } = useFetchLikedBooks(API_BASE_URL, token);

    const { toggleLike } = useToggleLike(token, likedBooks, setLikedBooks);

    const { updateQuantity } = useUpdateCartQuantity(API_BASE_URL, token, cartBooks, setCartBooks);

    useEffect(() => {
        if (!isLoggedIn) {
            setCartBooks(new Map());
            setLikedBooks(new Set());
            return;
        }

        // Fetch cart books
        axios.get(`${API_BASE_URL}/api/books/cart`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                const cartMap = new Map(response.data.map(item => [item.book.id, item]));
                setCartBooks(cartMap);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching cart items:", error);
                setLoading(false);
                notification.error({
                    message: 'Error',
                    description: 'Could not fetch cart items. Please try again.',
                    placement: 'topRight',
                });
            });
    }, [isLoggedIn, token, setLikedBooks]); // Only fetch cart when logged in

    if (loading) {
        return <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: "20%" }} />;
    }

    return cartBooks.size === 0 ? (
        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "18px", color: isDarkMode ? "#888" : "#444" }}>
            <ShoppingCartOutlined style={{ fontSize: "48px", marginBottom: "10px" }} />
            <p>Your cart is empty</p>
        </div>
    ) : (
        <BookList
            books={Array.from(cartBooks.values()).map(item => item.book)}
            cartBooks={cartBooks}
            isDarkMode={isDarkMode}
            toggleLike={toggleLike}
            addToCart={addToCart}
            likedBooks={likedBooks} // Use the likedBooks from the custom hook
            isCartComponent={true}
            updateQuantity={updateQuantity}  // Reuse the updated function here
        />
    );
};

export default CartItemsPage;
