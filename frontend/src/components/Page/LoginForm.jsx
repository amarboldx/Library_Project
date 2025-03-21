import { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import axios
import { useLoggedIn } from "../Context/LoggedInContext.jsx";
import { API_BASE_URL } from "../Config/src.jsx";

function LoginForm() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useLoggedIn();

    const handleSubmit = async (values) => {
        const { username, password } = values;
        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/login`, { username, password });

            const data = response.data;

            console.log('Login successful:', data);
            localStorage.setItem('jwtToken', data.jwtToken);
            login(data.jwtToken);
            message.success(`Welcome, ${data.username}!`);

            if (data.roles && data.roles.includes('ADMIN')) {
                navigate('/admin-dashboard');
            } else {
                navigate('/user-dashboard');
            }
        } catch (error) {
            if (error.response) {
                console.error('Error during login:', error.response.data);
                message.error(error.response.data.message || 'Login failed');
            } else if (error.request) {
                console.error('No response received:', error.request);
                message.error('No response from server');
            } else {
                console.error('Error:', error.message);
                message.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', marginTop: '100px' }}>
            <Typography style={{ marginBottom: '20px', textAlign: "center"}}>
                <h2>Login</h2>
            </Typography>

            <Form
                name="loginForm"
                layout="vertical"
                onFinish={handleSubmit}
                style={{ marginTop: '20px' }}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please enter your username!' }]}
                >
                    <Input placeholder="Enter your username" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password!' }]}
                >
                    <Input.Password placeholder="Enter your password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default LoginForm;
