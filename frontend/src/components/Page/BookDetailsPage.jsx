import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Spin, Card, Typography, Button, notification } from "antd";
import { ShoppingCartOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { API_BASE_URL } from "../Config/src.jsx";
import { ThemeContext } from "../Context/ThemeContext";
import useFetchCartItems from "../Hooks/useFetchCartItems";
import useUpdateCartQuantity from "../Hooks/useUpdateCartQuantity";
import axios from "axios";
import useAddToCart from "../Hooks/useAddToCart.jsx";

const { Title, Text } = Typography;

const BookDetailsPage = () => {
    const { bookId } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useContext(ThemeContext);
    const token = localStorage.getItem("jwtToken");

    // Fetch cart items
    const { cartBooks, setCartBooks } = useFetchCartItems(API_BASE_URL, token);
    const { updateQuantity } = useUpdateCartQuantity(API_BASE_URL, token, cartBooks, setCartBooks);
    const { addToCart } = useAddToCart(token, cartBooks, setCartBooks);
    const isInCart = cartBooks?.has(bookId);
    const quantity = isInCart ? cartBooks.get(bookId).quantity : 0;

    useEffect(() => {
        // Fetch book details
        axios.get(`${API_BASE_URL}/api/books/get/${bookId}`)
            .then((response) => {
                setBook(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching book details:", error);
                setLoading(false);
                notification.error({
                    message: "Error",
                    description: "Could not fetch book details. Please try again.",
                    placement: "topRight",
                });
            });
    }, [bookId]);

    const handleIncreaseQuantity = () => {
        updateQuantity(bookId, quantity + 1);
    };

    const handleDecreaseQuantity = () => {
        updateQuantity(bookId, quantity - 1);
    };

    if (loading) {
        return <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: "20%" }} />;
    }

    if (!book) {
        return <Text type="danger">Book not found</Text>;
    }

    return (
        <div
            style={{
                padding: "20px",
                textAlign: "center",
                backgroundColor: isDarkMode ? "#212121" : "#ffffff",
                color: isDarkMode ? "#ffffff" : "#000000",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Card
                style={{
                    width: "90%",
                    maxWidth: "800px",
                    margin: "auto",
                    padding: "20px",
                    backgroundColor: isDarkMode ? "#333" : "#fff",
                    borderColor: isDarkMode ? "#444" : "#ddd",
                }}
                cover={
                    <img
                        alt={book.title}
                        src={book.cover}
                        style={{ maxHeight: "400px", objectFit: "contain", width: "100%" }}
                    />
                }
            >
                <Title level={2} style={{ color: isDarkMode ? "#ffffff" : "#000000", fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}>
                    {book.title}
                </Title>
                <Text strong style={{ color: isDarkMode ? "#bbbbbb" : "#333", fontSize: "clamp(1rem, 3vw, 1.5rem)" }}>
                    By {book.author}
                </Text>
                <p style={{ color: isDarkMode ? "#cccccc" : "#595959", fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)" }}>
                    {book.description}
                </p>
                <Text strong style={{ color: isDarkMode ? "#ffffff" : "#000000", fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)" }}>
                    Genre:{" "}
                </Text>
                <Text style={{ color: isDarkMode ? "#bbbbbb" : "#333", fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)" }}>
                    {book.genre}
                </Text>
                <br />
                <Text strong style={{ color: isDarkMode ? "#ffffff" : "#000000", fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)" }}>
                    Pages:{" "}
                </Text>
                <Text style={{ color: isDarkMode ? "#bbbbbb" : "#333", fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)" }}>
                    {book.pages}
                </Text>
                <br />
                <Text strong style={{ color: isDarkMode ? "#ffffff" : "#000000", fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)" }}>
                    Price:{" "}
                </Text>
                <Text style={{ color: isDarkMode ? "#bbbbbb" : "#333", fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)" }}>
                    ${book.price}
                </Text>
                <br />

                {/* Displaying Cart Management Controls */}
                {isInCart ? (
                    <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Button
                            icon={<MinusOutlined />}
                            onClick={handleDecreaseQuantity}
                            style={{ marginRight: "10px" }}
                            disabled={quantity < 1}
                        />
                        <Text strong style={{ fontSize: "clamp(1rem, 3vw, 1.5rem)" }}>{quantity}</Text>
                        <Button
                            icon={<PlusOutlined />}
                            onClick={handleIncreaseQuantity}
                            style={{ marginLeft: "10px" }}
                        />
                    </div>
                ) : (
                    <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={() => addToCart(bookId)}
                        style={{ marginTop: "20px", width: "100%", maxWidth: "200px" }}
                    >
                        Add to Cart
                    </Button>
                )}
            </Card>
        </div>
    );
};

export default BookDetailsPage;