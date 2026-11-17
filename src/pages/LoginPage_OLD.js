import React, { useState } from 'react';
import { authAPI } from '../services/apiService';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: 'user' // user, admin, staff
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login(formData.email, formData.password);
            
            if (response.data && response.data.token) {
                // Store token in localStorage
                localStorage.setItem('access_token', response.data.token);
                localStorage.setItem('user_type', formData.userType);
                localStorage.setItem('user_email', formData.email);
                
                // Redirect based on user type
                switch(formData.userType) {
                    case 'admin':
                        window.location.href = '/admin-dashboard';
                        break;
                    case 'staff':
                        window.location.href = '/staff-dashboard';
                        break;
                    default:
                        window.location.href = '/user-dashboard';
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h2>Smart Ride Login</h2>
            
            {error && (
                <div style={{ color: 'red', marginBottom: '15px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Login As:</label>
                    <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                    </select>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: loading ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <a href="/forgot-password" style={{ marginRight: '15px' }}>
                    Forgot Password?
                </a>
                <a href="/register">
                    Create Account
                </a>
            </div>
        </div>
    );
};

export default LoginForm;