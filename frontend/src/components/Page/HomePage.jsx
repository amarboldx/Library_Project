import { useContext, useEffect, useState } from "react";
import { Spin } from "antd";
import { ThemeContext } from "../Context/ThemeContext.jsx";
import { useLoggedIn } from "../Context/LoggedInContext.jsx";
import useToggleLike from "../Hooks/useToggleLike.jsx";
import useAddToCart from "../Hooks/useAddToCart.jsx";
import BookList from "../Hooks/BookList.jsx";
import useFetchBooks from "../Hooks/useFecthBooks.jsx";
import useFetchLikedBooks from "../Hooks/useFetchLikedBooks.jsx";
import useFetchCartItems from "../Hooks/useFetchCartItems.jsx";
import { API_BASE_URL } from "../Config/src.jsx";
import SearchBooks from "../SearchBooks.jsx";
import NoBooksFound from "../Hooks/NoBooksFound.jsx";

const HomePage = () => {
    const { isLoggedIn } = useLoggedIn();
    const { isDarkMode } = useContext(ThemeContext);
    const token = localStorage.getItem("jwtToken");

    const { books, loading } = useFetchBooks(API_BASE_URL);
    const { likedBooks, setLikedBooks } = useFetchLikedBooks(API_BASE_URL, token);
    const { cartBooks, setCartBooks } = useFetchCartItems(API_BASE_URL, token);
    const { toggleLike } = useToggleLike(token, likedBooks, setLikedBooks);
    const { addToCart } = useAddToCart(token, cartBooks, setCartBooks);

    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!isLoggedIn) {
            setLikedBooks(new Set());
            setCartBooks(new Map());
        }
    }, [isLoggedIn, setLikedBooks, setCartBooks]);

    if (loading) {
        return <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: "20%" }} />;
    }

    const booksToShow = searchQuery.length > 0 ? searchResults : books;
    return (
        <div style={{ padding: "20px"}}>
            <SearchBooks
                onSearch={setSearchResults}
                onQueryChange={setSearchQuery}
            />

            {searchQuery.length > 0 && searchResults.length === 0 ? (
                <NoBooksFound />
            ) : (
                <BookList
                    books={booksToShow}
                    isDarkMode={isDarkMode}
                    toggleLike={toggleLike}
                    addToCart={addToCart}
                    likedBooks={likedBooks}
                    cartBooks={cartBooks}
                    isCartComponent={false}
                    updateQuantity={null}
                    handleCheckout={null}
                />
            )}
        </div>
    );
};

export default HomePage;
