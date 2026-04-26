import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './AdminLogin.css';

function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.login(username, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Credențiale incorecte. Încearcă din nou.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-emblem">⬡</div>
                    <h1 className="login-title">ADMIN</h1>
                    <p className="login-subtitle">Federația de Judo Moldova</p>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="field-group">
                        <label className="field-label">Utilizator</label>
                        <input className="field-input" type="text" value={username}
                            onChange={e => setUsername(e.target.value)} placeholder="username" required />
                    </div>
                    <div className="field-group">
                        <label className="field-label">Parolă</label>
                        <input className="field-input" type="password" value={password}
                            onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                    </div>
                    {error && <p className="login-error">{error}</p>}
                    <button className="login-btn" type="submit" disabled={loading}>
                        {loading ? <span className="login-spinner" /> : 'INTRĂ'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
