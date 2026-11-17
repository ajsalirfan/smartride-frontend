import axios from 'axios';
import { API_BASE_URL } from './apiConfig'; // ✅ ഇത് കൂടി ചേർക്കുക

const API_BASE = API_BASE_URL; // ✅ ഇവിടെ പുതിയ വേരിയബിൾ കൊടുക്കുക

// Create axios instance
const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
});
// Add response interceptor to stop infinite 404 loops
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 404) {
            console.error('❌ 404 Error - Endpoint not found:', error.config?.url);
            // Stop infinite retries
            throw new Error(`API endpoint not found: ${error.config?.url}`);
        }
        return Promise.reject(error);
    }
);

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authAPI = {
    // ✅ CORRECTED: Match your Django backend exactly
    login: (email, password) => 
        api.post('/Users/login/', { email, password }),
    
    register: (userData) => 
        api.post('/Users/register/', userData),
    
    forgotPassword: (email) => 
        api.post('/Users/forgot-password/', { email }),
    
    resetPassword: (token, newPassword) => 
        api.post('/Users/reset-password/', { token, new_password: newPassword }),
    
    logout: () => 
        api.post('/Users/logout/'),
    
    changePassword: (currentPassword, newPassword) => 
        api.post('/Users/change-password/', { 
            current_password: currentPassword, 
            new_password: newPassword 
        })
};

export const userAPI = {
    getProfile: () => 
        api.get('/Users/profile/'),
    
    updateProfile: (profileData) => 
        api.put('/Users/profile/update/', profileData)
};

export default api;