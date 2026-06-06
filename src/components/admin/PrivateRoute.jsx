// src/components/admin/PrivateRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children, requireSuperAdmin = false }) {
    const location = useLocation();
    const token = sessionStorage.getItem('accessToken');
    const role = sessionStorage.getItem('role');

    if (!token || !role) {
        return <Navigate to="/admin/login" replace state={{ from: location }} />;
    }

    if (requireSuperAdmin && role !== 'SUPER_ADMIN') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
}

export default PrivateRoute;