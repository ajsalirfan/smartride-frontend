import { authAPI } from './api';

export const authService = {
    login: async (email, password) => {
        const response = await authAPI.login(email, password);
        return response.data;
    },
    
    register: async (userData) => {
        const response = await authAPI.register(userData);
        return response.data;
    },
    
    forgotPassword: async (email) => {
        const response = await authAPI.forgotPassword(email);
        return response.data;
    },
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_type');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    },
    
    getCurrentUser: () => {
        return {
            token: localStorage.getItem('token'),
            user_type: localStorage.getItem('user_type'),
            user_id: localStorage.getItem('user_id'),
            user_name: localStorage.getItem('user_name')
        };
    },
    
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};