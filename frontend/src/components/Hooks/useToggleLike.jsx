import axios from "axios";
import { API_BASE_URL } from "../Config/src.jsx";
import { notification } from "antd";

const useToggleLike = (token, likedBookIds, setLikedBookIds) => {
    const toggleLike = async (bookId) => {
        if (!token) {
            notification.warning({
                message: "Please Log In",
                description: "You need to log in or sign up to like books.",
                placement: "topRight",
            });
            return;
        }

        const isLiked = likedBookIds.has(bookId);
        const url = isLiked
            ? `${API_BASE_URL}/api/books/remove-from-liked/${bookId}`
            : `${API_BASE_URL}/api/books/add-to-liked/${bookId}`;

        // Optimistically update UI
        setLikedBookIds((prev) => {
            const updated = new Set(prev);
            isLiked ? updated.delete(bookId) : updated.add(bookId);
            return updated;
        });

        try {
            await axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });

            notification.success({
                message: isLiked ? "Removed from Liked" : "Added to Liked",
                description: isLiked
                    ? "The book has been removed from your liked list."
                    : "Successfully added to your liked list.",
                placement: "topRight",
            });
        } catch (error) {
            // Revert UI if request fails
            setLikedBookIds((prev) => {
                const reverted = new Set(prev);
                isLiked ? reverted.add(bookId) : reverted.delete(bookId);
                return reverted;
            });

            console.error("Error toggling like:", error);
            notification.error({
                message: "Error",
                description: "Could not update liked books. Please try again.",
                placement: "topRight",
            });
        }
    };

    return { toggleLike };
};

export default useToggleLike;
