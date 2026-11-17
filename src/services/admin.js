import api from './api';

export const adminService = {
    // Admin approve verification
    approveVerification: async (userId) => {
        const response = await api.post(`/Users/admin/verify-user/${userId}/approve/`);
        return response.data;
    },

    // Admin reject verification
    rejectVerification: async (userId, rejectionReason) => {
        const response = await api.post(`/Users/admin/verify-user/${userId}/reject/`, {
            rejection_reason: rejectionReason
        });
        return response.data;
    },

    // Get all users (for admin)
    getAllUsers: async () => {
        const response = await api.get('/Users/admin/users/');
        return response.data;
    },

    // Get admin stats
    getStats: async () => {
        // This would be from your Admin app
        const response = await api.get('/admin/stats/');
        return response.data;
    }
};