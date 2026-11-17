import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
});

export const authAPI = {
    // 🔹 Login User
    login: (email, password) =>
        api.post('/Users/login/', { email, password }),

    // 🔹 Register User
    register: (userData) =>
        api.post('/Users/register/', userData),

    // 🔹 Forgot Password (Send OTP)
    forgotPassword: (email) =>
        api.post('/Users/forgot-password/', { email }),

    // 🔹 Reset Password (With OTP)
    resetPassword: (email, otp_code, new_password, confirm_password) =>
        api.post('/Users/reset-password/', {
            email,
            otp_code,
            new_password,
            confirm_password,
        }),
};

export default api;
