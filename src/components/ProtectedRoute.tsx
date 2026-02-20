import { Navigate as RouterNavigate, Outlet as RouterOutlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../context/AuthContext';

interface ProtectedRouteProps {
    allowedRoles?: Role[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { user } = useAuth();

    if (!user) {
        // Not logged in, redirect to login page
        return <RouterNavigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Logged in but wrong role, redirect to appropriate home
        const redirectPath = user.role === 'ADMIN' ? '/admin' : '/';
        return <RouterNavigate to={redirectPath} replace />;
    }

    // Authorized, render child routes
    return <RouterOutlet />;
}
