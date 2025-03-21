import { Button } from "antd";
import PropTypes from "prop-types";

const CheckoutSummary = ({ cartBooks, totalCost, handleCheckout, isDarkMode }) => {
    const cartItems = [...cartBooks.values()];

    return (
        <div
            style={{
                backgroundColor: isDarkMode ? "#333" : "#f9f9f9",
                padding: "20px",
                position: "fixed",
                bottom: "0",
                left: "0",
                right: "0",
                textAlign: "center",
            }}
        >
            <h3 style={{ marginBottom: "10px", color: isDarkMode ? "#ffffff" : "#000000" }}>Cart Summary</h3>
            <div
                style={{
                    marginBottom: "10px",
                    color: isDarkMode ? "#ffffff" : "#000000",
                    fontSize: "16px",
                }}
            >
                <ul style={{ listStyle: "none", padding: "0", textAlign: "left" }}>
                    {cartItems.map(item => (
                        <li key={item.book.id}>
                            {item.book.title} - {item.quantity} x ${item.book.price} = ${(item.quantity * item.book.price).toFixed(2)}
                        </li>
                    ))}
                </ul>
            </div>
            <div
                style={{
                    marginBottom: "10px",
                    fontWeight: "bold",
                    color: isDarkMode ? "#ffffff" : "#000000",
                    fontSize: "18px",
                }}
            >
                Total: ${totalCost.toFixed(2)}
            </div>
            <Button
                type="primary"
                size="large"
                onClick={handleCheckout}
                style={{
                    backgroundColor: "#ff4d4f",
                    borderColor: "#ff4d4f",
                }}
            >
                Checkout
            </Button>
        </div>
    );
};

CheckoutSummary.propTypes = {
    cartBooks: PropTypes.instanceOf(Map).isRequired,
    totalCost: PropTypes.number.isRequired,
    handleCheckout: PropTypes.func.isRequired,
    isDarkMode: PropTypes.bool.isRequired,
};

export default CheckoutSummary;
