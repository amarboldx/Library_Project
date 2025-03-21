import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/Page/LoginForm.jsx";
import AdminDashBoard from "./components/Page/AdminDashBoard.jsx";
import UserDashBoard from "./components/UserDashBoard.jsx";
import HomePage from "./components/Page/HomePage.jsx";
import MainLayout from "./components/MainLayout.jsx"; // Your new layout component
import { ThemeProvider } from "./components/Context/ThemeContext.jsx";
import "./App.css";
import CartItemsPage from "./components/Page/CartItemsPage.jsx";
import LikedBooks from "./components/Page/LikedBooksPage.jsx";
import BookDetailsPage from "./components/Page/BookDetailsPage.jsx";
import {LoggedInProvider} from "./components/Context/LoggedInContext.jsx";
import LikedBooksPage from "./components/Page/LikedBooksPage.jsx";



function App() {
    return (
        <LoggedInProvider >
        <ThemeProvider >
            <Router>
                <Routes>
                    {/* Routes without Sidebar */}
                    <Route path="/login" element={<LoginForm />} />

                    {/* Routes with Sidebar */}
                    <Route
                        path="/home"
                        element={
                            <MainLayout>
                                <HomePage />
                            </MainLayout>
                        }
                    />
                    <Route
                        path="/cart"
                        element={
                            <MainLayout>
                                <CartItemsPage />
                            </MainLayout>
                        }
                    />
                    <Route
                        path="/liked-books"
                        element={
                            <MainLayout>
                                <LikedBooks />
                            </MainLayout>
                        }
                    />
                    <Route
                        path="/admin-dashboard"
                        element={
                            <MainLayout>
                                <AdminDashBoard />
                            </MainLayout>
                        }
                    />
                    <Route
                        path="/user-dashboard"
                        element={
                            <MainLayout>
                                <UserDashBoard />
                            </MainLayout>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <MainLayout>
                                <LikedBooksPage />
                            </MainLayout>
                        }
                    />
                    <Route
                        path="/book/:bookId"
                        element={
                            <MainLayout>
                                <BookDetailsPage />
                            </MainLayout>
                        }
                    />
                </Routes>
            </Router>
            </ThemeProvider>
            </LoggedInProvider>
    );
}

export default App;