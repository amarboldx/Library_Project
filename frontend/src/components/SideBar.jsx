import React, { useContext, useState } from "react";
import { Layout, Menu, Switch } from "antd";
import {
    BulbOutlined,
    HeartOutlined,
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    LoginOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { ThemeContext } from "./Context/ThemeContext.jsx";
import { useNavigate } from "react-router-dom";
import { getUserRoleFromJwt } from "./Utils/getUserRoleFromJwt.jsx";
import { useLoggedIn } from "./Context/LoggedInContext.jsx";
import { notification } from "antd/lib";


const { Sider } = Layout;

const checkValidToken = () => {
    return localStorage.getItem("jwtToken");
};

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useLoggedIn();

    const handleProfileOrLoginClick = () => {
        if (isLoggedIn) {
            if (checkValidToken()) {
                const roles = getUserRoleFromJwt();
                if (roles && roles.includes("ADMIN")) {
                    navigate("/admin-dashboard");
                } else {
                    navigate("/user-dashboard");
                }
            }
        } else {
            notification.warning({
                message: "Please Log In",
                description: "You need to log in or sign up to access the profile.",
                placement: "topRight",
            });
            navigate("/login");
        }
    };

    const handleLogoutClick = () => {
        logout();

        notification.success({
            message: "Logged Out",
            description: "You have successfully logged out.",
            placement: "topRight",
        });
    };

    const handleHomeClick = () => {
        navigate("/home");
    };
    const handleLikedBooksClick = () => {
        if (!isLoggedIn) {
            notification.warning({
                message: "Please Log In",
                description: "You need to log in or sign up to access liked books.",
                placement: "topRight",
            });
        } else {
            navigate("/liked-books");
        }
    };

    const handleCartClick = () => {
        if (!isLoggedIn) {
            notification.warning({
                message: "Please Log In",
                description: "You need to log in or sign up to access your cart.",
                placement: "topRight",
            });
        } else {
            navigate("/cart");
        }
    };

    const darkModeColors = {
        sidebarBackground: "#1a1a1a",
        menuBackground: "#1a1a1a",
        menuTextColor: "#ffffff",
        menuSelectedBackground: "#333333",
        menuHoverBackground: "#262626",
        borderColor: "#404040",
    };

    const lightModeColors = {
        sidebarBackground: "#d3d3d3",
        menuBackground: "#d3d3d3",
        menuTextColor: "#000000",
        menuSelectedBackground: "#e6f7ff",
        menuHoverBackground: "#f0f0f0",
        borderColor: "#f0f0f0",
    };

    const colors = isDarkMode ? darkModeColors : lightModeColors;

    const menuItems = [
        {
            key: "1",
            icon: <HomeOutlined />,
            label: "Home",
            onClick: handleHomeClick,
        },
        {
            key: "2",
            icon: <HeartOutlined />,
            label: "Liked Books",
            onClick: handleLikedBooksClick,
        },
        {
            key: "3",
            icon: <ShoppingCartOutlined />,
            label: "Cart",
            onClick: handleCartClick,
        },
        {
            key: "4",
            icon: isLoggedIn ? <UserOutlined /> : <LoginOutlined />,
            label: isLoggedIn ? "Profile" : "Login",
            onClick: handleProfileOrLoginClick,
        },
        isLoggedIn && {
            key: "5",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: handleLogoutClick,
        },
    ].filter(Boolean);

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={() => setCollapsed(!collapsed)}
            trigger={null}
            width={200}
            style={{
                overflow: "auto",
                height: "100vh",
                position: "fixed",
                left: 0,
                backgroundColor: colors.sidebarBackground,
            }}
            theme={isDarkMode ? "dark" : "light"}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "16px",
                    backgroundColor: colors.sidebarBackground,
                }}
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? (
                    <MenuUnfoldOutlined style={{ color: colors.menuTextColor, fontSize: "16px" }} />
                ) : (
                    <MenuFoldOutlined style={{ color: colors.menuTextColor, fontSize: "16px" }} />
                )}
            </div>

            <Menu
                theme={isDarkMode ? "dark" : "light"}
                mode="inline"
                defaultSelectedKeys={["1"]}
                style={{
                    backgroundColor: colors.menuBackground,
                    color: colors.menuTextColor,
                }}
                items={menuItems.map((item) => ({
                    ...item,
                    style: {
                        backgroundColor: colors.menuBackground,
                        color: colors.menuTextColor,
                    },
                    icon: React.cloneElement(item.icon, { style: { color: colors.menuTextColor } }),
                }))}
            />

            <div
                style={{
                    padding: "16px",
                    borderTop: `1px solid ${colors.borderColor}`,
                    textAlign: "center",
                }}
            >
                <Switch
                    checked={isDarkMode}
                    onChange={toggleTheme}
                    checkedChildren={<BulbOutlined />}
                    unCheckedChildren={<BulbOutlined />}
                />
            </div>
        </Sider>
    );
};

export default Sidebar;
