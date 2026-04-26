// src/components/admin/AdminLayout.jsx
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import './AdminLayout.css';

const navItems = [
    { section: 'Conținut' },
    { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/admin/news', icon: '📰', label: 'Știri' },
    { to: '/admin/competitions', icon: '🏆', label: 'Competiții' },
    { to: '/admin/results', icon: '🥇', label: 'Rezultate' },
    { to: '/admin/athletes', icon: '🥋', label: 'Sportivi' },
    { to: '/admin/sponsors', icon: '🤝', label: 'Sponsori' },
    { section: 'Sistem' },
    { to: '/admin/users', icon: '👤', label: 'Admini', superAdmin: true },
];

function AdminLayout({ children, title }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        authService.me().then(data => {
            if (data) {
                setUsername(data.username);
                setRole(data.role);
            }
        });
    }, []);

    const handleLogout = () => {
        authService.logout();
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <p className="admin-sidebar-title">FJM Admin</p>
                    <p className="admin-sidebar-role">{role}</p>
                </div>

                <nav className="admin-nav">
                    {navItems.map((item, i) => {
                        if (item.section) {
                            return <p key={i} className="admin-nav-section">{item.section}</p>;
                        }
                        if (item.superAdmin && role !== 'SUPER_ADMIN') return null;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `admin-nav-link${isActive ? ' active' : ''}`}
                            >
                                <span className="admin-nav-icon">{item.icon}</span>
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="admin-sidebar-footer">
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        🚪 Deconectare
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="admin-main">
                <div className="admin-topbar">
                    <h1 className="admin-topbar-title">{title}</h1>
                    <span className="admin-topbar-user">👤 {username}</span>
                </div>
                <div className="admin-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;
