import { useState, useContext, useEffect } from 'react';
import { Layout, Menu, Button, Switch, notification, Badge } from 'antd';
import {
    HomeOutlined,
    HeartOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    LoginOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    BulbOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from './Context/ThemeContext';
import { useLoggedIn } from './Context/LoggedInContext';
import { getUserRoleFromJwt } from './Utils/getUserRoleFromJwt';
import '../Styles/SideBar.css';
import axios from 'axios';
import { API_BASE_URL } from './Config/src.jsx';

const { Header, Sider, Content } = Layout;

// eslint-disable-next-line react/prop-types
const MainLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(true);
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const { isLoggedIn, logout } = useLoggedIn();
    const [likedCount, setLikedCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            if (isLoggedIn) {
                const token = localStorage.getItem('jwtToken');
                if (!token) return;

                try {
                    const [likedResponse, cartResponse] = await Promise.all([
                        axios.get(`${API_BASE_URL}/api/books/liked-count`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        }),
                        axios.get(`${API_BASE_URL}/api/books/cart-count`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        }),
                    ]);

                    setLikedCount(likedResponse.data);
                    setCartCount(cartResponse.data);
                } catch (error) {
                    console.error('Error fetching counts:', error);
                    if (error.response?.status === 401) {
                        logout(); // Logout if token is invalid
                        notification.error({
                            message: 'Session Expired',
                            description: 'Please log in again.',
                            placement: 'topRight',
                        });
                    }
                }
            } else {
                setLikedCount(0);
                setCartCount(0);
            }
        };

        fetchCounts();
        const interval = setInterval(fetchCounts, 3000);

        return () => clearInterval(interval);
    }, [isLoggedIn, logout]);

    const handleProfileOrLoginClick = () => {
        if (isLoggedIn) {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                const roles = getUserRoleFromJwt();
                if (roles && roles.includes('ADMIN')) {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/user-dashboard');
                }
            }
        } else {
            notification.warning({
                message: 'Please Log In',
                description: 'You need to log in or sign up to access the profile.',
                placement: 'topRight',
            });
            navigate('/login');
        }
    };

    const handleLikedBooksClick = () => {
        if (!isLoggedIn) {
            notification.warning({
                message: 'Please Log In',
                description: 'You need to log in or sign up to access liked books.',
                placement: 'topRight',
            });
            navigate('/login');
        } else {
            navigate('/liked-books');
        }
    };

    const handleCartClick = () => {
        if (!isLoggedIn) {
            notification.warning({
                message: 'Please Log In',
                description: 'You need to log in or sign up to access your cart.',
                placement: 'topRight',
            });
            navigate('/login');
        } else {
            navigate('/cart');
        }
    };

    const handleLogoutClick = () => {
        logout();
        notification.success({
            message: 'Logged Out',
            description: 'You have successfully logged out.',
            placement: 'topRight',
        });
        navigate('/home');
    };

    const menuItems = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: 'Home',
            onClick: () => navigate('/home'),
        },
        {
            key: 'liked',
            icon: <HeartOutlined />,
            label: (
                <Badge count={likedCount} size="small" offset={[10, 0]}>
                    <div style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                        Liked Books
                    </div>
                </Badge>
            ),
            onClick: handleLikedBooksClick,
        },
        {
            key: 'cart',
            icon: <ShoppingCartOutlined />,
            label: (
                <Badge count={cartCount} size="small" offset={[10, 0]}>
                    <div style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                        Cart
                    </div>
                </Badge>
            ),
            onClick: handleCartClick,
        },
        {
            key: 'profile',
            icon: isLoggedIn ? <UserOutlined /> : <LoginOutlined />,
            label: isLoggedIn ? 'Profile' : 'Login',
            onClick: handleProfileOrLoginClick,
        },
    ];

    if (isLoggedIn) {
        menuItems.push({
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: handleLogoutClick,
        });
    }

    const siderStyle = {
        background: isDarkMode ? '#0D0D0D' : '#fff',
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        zIndex: 1000,
        boxShadow: !collapsed ? '2px 0 8px rgba(0,0,0,0.15)' : 'none',
        transition: 'all 0.2s ease',
        transform: collapsed ? 'translateX(-100%)' : 'translateX(0)',
    };

    const layoutStyle = {
        minHeight: '100vh',
        background: isDarkMode ? '#212121' : '#fff',
        marginLeft: 0,
        transition: 'margin 0.2s ease',
    };

    const overlayStyle = {
        display: collapsed ? 'none' : 'block',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 999,
    };

    return (
        <Layout>
            <div style={overlayStyle} onClick={() => setCollapsed(true)} />

            <Sider
                style={siderStyle}
                width={200}
                theme={isDarkMode ? 'dark' : 'light'}
                collapsed={collapsed}
            >
                <div style={{ padding: '16px', textAlign: 'right' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            color: isDarkMode ? '#fff' : undefined,
                        }}
                    />
                </div>

                <Menu
                    mode="inline"
                    theme={isDarkMode ? 'dark' : 'light'}
                    items={menuItems}
                    style={{
                        borderRight: 0,
                        background: isDarkMode ? '#0D0D0D' : '#fff',
                    }}
                />

                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        padding: '16px',
                        borderTop: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
                        textAlign: 'center',
                        background: isDarkMode ? '#0D0D0D' : '#fff',
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

            <Layout style={layoutStyle}>
                <Header
                    style={{
                        padding: '0 16px',
                        background: isDarkMode ? '#212121' : '#fff',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                        display: 'flex',
                        alignItems: 'center',
                        color: isDarkMode ? '#fff' : undefined,
                        borderBottom: `1px solid ${
                            isDarkMode ? '#303030' : '#f0f0f0'
                        }`,
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                            color: isDarkMode ? '#fff' : undefined,
                        }}
                    />
                </Header>

                <Content
                    className={collapsed ? '' : 'tinted'}
                    style={{
                        margin: '24px 16px',
                        minHeight: 280,
                        color: isDarkMode ? '#fff' : undefined,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
