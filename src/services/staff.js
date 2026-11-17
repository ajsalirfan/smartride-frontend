import api from './api';

export const staffService = {
    // Get staff tasks
    getTasks: async () => {
        const response = await api.get('/StaffWork/tasks/');
        return response.data;
    },

    // Update task status
    updateTaskStatus: async (taskId, status) => {
        const response = await api.post(`/StaffWork/update-task-status/${taskId}/`, {
            status
        });
        return response.data;
    },

    // Get emergency alerts
    getEmergencyAlerts: async () => {
        const response = await api.get('/StaffWork/emergency-alerts/');
        return response.data;
    },

    // Accept emergency
    acceptEmergency: async (alertId) => {
        const response = await api.post(`/StaffWork/accept-emergency/${alertId}/`);
        return response.data;
    },

    // Get staff directory
    getStaffDirectory: async () => {
        const response = await api.get('/Users/staff/directory/');
        return response.data;
    }
};