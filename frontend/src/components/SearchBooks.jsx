import { useState, useContext } from "react";
import { Input } from "antd";
import PropTypes from "prop-types";
import { API_BASE_URL } from "./Config/src.jsx";
import { ThemeContext } from "./Context/ThemeContext.jsx";
import "../Styles/SearchBooks.css";

const SearchBooks = ({ onSearch, onQueryChange }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const { isDarkMode } = useContext(ThemeContext);

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        onQueryChange(query);

        if (!query) {
            onSearch([]);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/books/get/search?query=${query}`);
            if (!response.ok) throw new Error("Failed to fetch search results");

            const data = await response.json();
            onSearch(data);
        } catch (error) {
            console.error("Error fetching search results:", error);
            onSearch([]);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <Input
                className={isDarkMode ? "search-input dark-mode" : "search-input"}
                placeholder="Search books..."
                value={searchQuery}
                onChange={handleSearch}
                style={{
                    width: "50%",
                    backgroundColor: isDarkMode ? "#333" : "#fff",
                    color: isDarkMode ? "#fff" : "#000",
                    border: isDarkMode ? "1px solid #555" : "1px solid #ddd",
                }}
            />
        </div>
    );
};

SearchBooks.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onQueryChange: PropTypes.func.isRequired,
};

export default SearchBooks;
