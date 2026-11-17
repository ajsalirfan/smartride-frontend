import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');

    // If no token, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If user type not in allowed roles, redirect to appropriate dashboard
    if (!allowedRoles.includes(userType)) {
        switch(userType) {
            case 'admin':
                return <Navigate to="/admin/dashboard" replace />;
            case 'staff':
                return <Navigate to="/staff/dashboard" replace />;
            case 'customer':
                return <Navigate to="/user/dashboard" replace />;
            default:
                return <Navigate to="/login" replace />;
        }
    }

    return children;
};

export default AuthGuard;