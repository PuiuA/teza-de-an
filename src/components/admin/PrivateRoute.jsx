// src/components/admin/PrivateRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/authService';

function PrivateRoute({ children, requireSuperAdmin = false }) {
    const [status, setStatus] = useState('loading'); // loading | ok | unauthorized
    const [role, setRole] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('accessToken');
        const role = sessionStorage.getItem('role');

        if (!token || !role) {
            setStatus('unauthorized');
            return;
        }
        if (requireSuperAdmin && role !== 'SUPER_ADMIN') {
            setStatus('unauthorized');
            return;
        }
        setRole(role);
        setStatus('ok');
    }, []);
    if (status === 'loading') return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100vh', color: '#4a90d9', fontSize: '16px'
        }}>
            Se verifică autentificarea...
        </div>
    );

    if (status === 'unauthorized') return <Navigate to="/admin/login" replace />;

    return children;
}

export default PrivateRoute;
