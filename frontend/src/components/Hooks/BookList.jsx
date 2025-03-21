import { Card, Row, Col, Button } from "antd";
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import CheckoutSummary from "../CheckoutSummary";
import { useNavigate } from "react-router-dom";
import "../../Styles/BookList.css"

const { Meta } = Card;

const BookList = ({
                      books,
                      isDarkMode,
                      toggleLike,
                      addToCart,
                      likedBooks,
                      cartBooks,
                      isCartComponent,
                      updateQuantity,
                      handleCheckout,
                  }) => {
    const cartItems = [...cartBooks.values()];
    const totalCost = cartItems.reduce((acc, item) => {
        if (item.book && item.book.price) {
            return acc + item.quantity * item.book.price;
        }
        return acc;
    }, 0);

    const navigate = useNavigate();

    return (
        <div className={`book-list-container ${isDarkMode ? "dark-mode" : ""} ${isCartComponent ? "cart-component" : ""}`}>
            <Row gutter={[12, 12]}>
                {books.map((book) => {
                    const bookId = book.id || Math.random().toString();
                    const isLiked = likedBooks.has(bookId);
                    const isInCart = cartBooks.has(bookId);
                    const cartItem = cartBooks.get(bookId);
                    const quantity = cartItem ? cartItem.quantity : 0;

                    return (
                        <Col key={bookId} xs={24} sm={12} md={8} lg={4}>
                            <Card
                                hoverable
                                className="book-card"
                                cover={
                                    <img
                                        alt={book.title}
                                        src={book.cover}
                                        className="book-cover"
                                    />
                                }
                                onClick={() => navigate(`/book/${bookId}`)}
                            >
                                <Meta
                                    title={<span className="book-title">{book.title}</span>}
                                    description={<span className="book-author">By {book.author}</span>}
                                />
                                <div className="book-info">
                                    <div className="book-price">${book.price}</div>
                                    <div className="book-actions">
                                        <Button
                                            icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
                                            className={`like-btn ${isLiked ? "liked" : ""}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleLike(bookId);
                                            }}
                                        />
                                        <Button
                                            icon={<ShoppingCartOutlined />}
                                            className={`cart-btn ${isInCart ? "in-cart" : ""}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(bookId);
                                            }}
                                        />
                                    </div>
                                </div>

                                {isCartComponent && isInCart && (
                                    <div className="quantity-controls">
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateQuantity(bookId, quantity - 1);
                                            }}
                                        >
                                            -
                                        </Button>
                                        <span>{quantity}</span>
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateQuantity(bookId, quantity + 1);
                                            }}
                                        >
                                            +
                                        </Button>
                                    </div>
                                )}

                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {/* Checkout Summary */}
            {isCartComponent && (
                <CheckoutSummary
                    cartBooks={cartBooks}
                    totalCost={totalCost}
                    handleCheckout={handleCheckout}
                    isDarkMode={isDarkMode}
                />
            )}
        </div>
    );
};

BookList.propTypes = {
    books: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            author: PropTypes.string.isRequired,
            year: PropTypes.number.isRequired,
            pages: PropTypes.number.isRequired,
            isbn: PropTypes.number.isRequired,
            genre: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            cover: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
        })
    ).isRequired,
    isDarkMode: PropTypes.bool.isRequired,
    toggleLike: PropTypes.func.isRequired,
    addToCart: PropTypes.func.isRequired,
    likedBooks: PropTypes.instanceOf(Set).isRequired,
    cartBooks: PropTypes.instanceOf(Map).isRequired,
    isCartComponent: PropTypes.bool.isRequired,
    updateQuantity: PropTypes.func.isRequired,
    handleCheckout: PropTypes.func.isRequired,
};

export default BookList;
