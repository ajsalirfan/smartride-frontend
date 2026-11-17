import api from './api';

export const userService = {
    // Get nearby vehicles
    getNearbyVehicles: async (latitude, longitude) => {
        const response = await api.get('/Users/vehicles/nearby/', {
            params: { lat: latitude, lng: longitude }
        });
        return response.data;
    },

    // Get available vehicles
    getAvailableVehicles: async () => {
        const response = await api.get('/Users/vehicles/available/');
        return response.data;
    },

    // Start ride
    startRide: async (rideData) => {
        const response = await api.post('/Users/rides/start/', rideData);
        return response.data;
    },

    // End ride
    endRide: async (rideData) => {
        const response = await api.post('/Users/rides/end/', rideData);
        return response.data;
    },

    // Get current ride
    getCurrentRide: async () => {
        const response = await api.get('/Users/rides/current/');
        return response.data;
    },

    // Get ride history
    getRideHistory: async () => {
        const response = await api.get('/Users/rides/history/');
        return response.data;
    },

    // Get ride details
    getRideDetail: async (rideId) => {
        const response = await api.get(`/Users/rides/${rideId}/`);
        return response.data;
    },

    // Cancel ride
    cancelRide: async (rideId) => {
        const response = await api.post(`/Users/rides/${rideId}/cancel/`);
        return response.data;
    },

    // Rate ride
    rateRide: async (rideId, rating, feedback = '') => {
        const response = await api.post(`/Users/rides/${rideId}/rate/`, {
            rating,
            feedback
        });
        return response.data;
    },

    // Get wallet balance
    getWalletBalance: async () => {
        const response = await api.get('/Users/wallet/balance/');
        return response.data;
    },

    // Add wallet balance
    addWalletBalance: async (amount, payment_method) => {
        const response = await api.post('/Users/wallet/topup/', {
            amount,
            payment_method
        });
        return response.data;
    },

    // Process UPI payment
    processUpiPayment: async (amount, upi_id, ride_id = null) => {
        const response = await api.post('/Users/payments/upi/', {
            amount,
            upi_id,
            ride_id
        });
        return response.data;
    },

    // Get payment history
    getPaymentHistory: async () => {
        const response = await api.get('/Users/payments/history/');
        return response.data;
    },

    // Upload verification documents
    uploadVerificationDocuments: async (documents) => {
        const response = await api.post('/Users/verification/upload-documents/', documents);
        return response.data;
    },

    // Get verification status
    getVerificationStatus: async () => {
        const response = await api.get('/Users/verification/status/');
        return response.data;
    },

    // Get emergency contacts
    getEmergencyContacts: async () => {
        const response = await api.get('/Users/emergency/contacts/');
        return response.data;
    },

    // Add emergency contact
    addEmergencyContact: async (contactData) => {
        const response = await api.post('/Users/emergency/contacts/add/', contactData);
        return response.data;
    },

    // Send emergency alert
    sendEmergencyAlert: async (alertData) => {
        const response = await api.post('/Users/emergency/alert/', alertData);
        return response.data;
    },

    // Get notifications
    getNotifications: async () => {
        const response = await api.get('/Users/notifications/');
        return response.data;
    },

    // Mark notification as read
    markNotificationRead: async (notificationId) => {
        const response = await api.post('/Users/notifications/mark-read/', {
            notification_id: notificationId
        });
        return response.data;
    },

    // Get ride statistics
    getRideStatistics: async () => {
        const response = await api.get('/Users/analytics/ride-statistics/');
        return response.data;
    },

    // Get carbon savings
    getCarbonSavings: async () => {
        const response = await api.get('/Users/analytics/carbon-savings/');
        return response.data;
    }
};