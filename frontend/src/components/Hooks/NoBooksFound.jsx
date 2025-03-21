import { Empty } from "antd";
import { useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext.jsx";

const NoBooksFound = () => {
    const { isDarkMode } = useContext(ThemeContext);

    return (
        <Empty
            description={
                <span style={{ color: isDarkMode ? "#bfbfbf" : "#595959" }}>
                    No books found
                </span>
            }
            style={{
                marginTop: "20px",
                padding: "20px",
                borderRadius: "8px",
            }}
            styles={{
                image: {
                    filter: isDarkMode ? "invert(0.7)" : "none",
                },
            }}
        />
    );
};

export default NoBooksFound;
