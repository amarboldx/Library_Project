import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Spin, notification } from "antd";
import { ThemeContext } from "../Context/ThemeContext.jsx";
import { useLoggedIn } from "../Context/LoggedInContext.jsx";
import { HeartTwoTone } from "@ant-design/icons";
import useToggleLike from "../Hooks/useToggleLike.jsx";
import useAddToCart from "../Hooks/useAddToCart.jsx";
import { API_BASE_URL } from "../Config/src.jsx";
import BookList from "../Hooks/BookList.jsx";
import useFetchCartItems from "../Hooks/useFetchCartItems.jsx"; // Imported the new hook

const LikedBooksPage = () => {
    const { isLoggedIn } = useLoggedIn();
    const [likedBooks, setLikedBooks] = useState([]);
    const [likedBookIds, setLikedBookIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useContext(ThemeContext);
    const token = localStorage.getItem('jwtToken');

    // Fetch cart items using custom hook
    const { cartBooks, setCartBooks } = useFetchCartItems(API_BASE_URL, token);

    // Hook to toggle likes
    const { toggleLike } = useToggleLike(token, likedBookIds, setLikedBookIds);

    // Hook to handle adding books to cart
    const { addToCart } = useAddToCart(token, cartBooks, setCartBooks);

    useEffect(() => {
        if (!isLoggedIn) {
            setLikedBooks([]);
            setLikedBookIds(new Set());
            setCartBooks(new Map());
            return;
        }

        // Fetch liked books
        axios.get(`${API_BASE_URL}/api/books/likedBooks`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                setLikedBooks(response.data);
                setLikedBookIds(new Set(response.data.map(book => book.id)));
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching liked books:", error);
                setLoading(false);
                notification.error({
                    message: 'Error',
                    description: 'Could not fetch liked books. Please try again.',
                    placement: 'topRight',
                });
            });
    }, [isLoggedIn, setCartBooks, token]);

    // Handle like/unlike
    const handleToggleLike = async (bookId) => {
        try {
            await toggleLike(bookId);

            setLikedBooks(prevBooks => {
                const updatedLikedBookIds = new Set(likedBookIds);
                if (updatedLikedBookIds.has(bookId)) {
                    updatedLikedBookIds.delete(bookId);
                } else {
                    updatedLikedBookIds.add(bookId);
                }

                return prevBooks.filter(book => updatedLikedBookIds.has(book.id));
            });

            setLikedBookIds(prevIds => {
                const updated = new Set(prevIds);
                if (updated.has(bookId)) {
                    updated.delete(bookId);
                } else {
                    updated.add(bookId);
                }
                return updated;
            });

        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    if (loading) {
        return <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: "20%" }} />;
    }

    return likedBooks.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "18px", color: isDarkMode ? "#888" : "#444" }}>
            <HeartTwoTone twoToneColor="#eb2f96" style={{ fontSize: "48px", marginBottom: "10px" }} />
            <p>No liked books found</p>
        </div>
    ) : (
        <BookList
            books={likedBooks}
            isDarkMode={isDarkMode}
            toggleLike={handleToggleLike}
            addToCart={addToCart}
            likedBooks={likedBookIds}
            cartBooks={cartBooks}
            updateQuantity={null}
            handleCheckout={null}
            isCartComponent={false}
        />
    );
};

export default LikedBooksPage;
