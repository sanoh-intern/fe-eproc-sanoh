import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, userRole, isLoading, logout } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    const token = localStorage.getItem("access_token");
    const lastActivity = localStorage.getItem("lastActivity");

    if (!isAuthenticated || !token || !lastActivity) {
        localStorage.clear();
        logout();
        return <Navigate to="/auth/login" replace />;
    }

    if (!allowedRoles.includes(userRole || '')) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;