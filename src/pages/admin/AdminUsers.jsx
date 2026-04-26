import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { authService } from '../../services/authService';

const currentUsername = sessionStorage.getItem('username');

function AdminUsers() {
    const [list, setList] = useState([]);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = () => {
        authService.fetchWithAuth('/api/admin/list')
            .then(r => r.json()).then(setList)
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleCreate = async () => {
        setError('');
        const res = await authService.fetchWithAuth('/api/admin/create', {
            method: 'POST',
            body: JSON.stringify(form),
        });

        if (!res.ok) {
            try {
                const data = await res.json();
                setError(data.error || 'Eroare la creare');
            } catch {
                setError('Eroare la creare');
            }
            return;
        }

        setModal(null);
        setForm({ username: '', password: '' });
        load();
    };

    const handleDelete = async () => {
        await authService.fetchWithAuth(`/api/admin/${selected.id}`, { method: 'DELETE' });
        setModal(null);
        setSelected(null);
        load();
    };

    const handleRoleChange = async (admin, newRole) => {
        if (newRole === admin.role) return;
        await authService.fetchWithAuth(`/api/admin/${admin.id}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role: newRole }),
        });
        load();
    };

    return (
        <AdminLayout title="Admini">
            <div className="admin-page-header">
                <h2 className="admin-page-title">Gestionare Admini</h2>
                <button className="admin-add-btn" onClick={() => { setForm({ username: '', password: '' }); setModal('add'); }}>
                    + Adaugă Admin
                </button>
            </div>

            <div className="admin-table-wrapper">
                {loading ? <p className="admin-empty">Se încarcă...</p> :
                    list.length === 0 ? <p className="admin-empty">Nu există admini.</p> : (
                        <table className="admin-table">
                            <thead>
                            <tr><th>ID</th><th>Username</th><th>Rol</th><th>Acțiuni</th></tr>
                            </thead>
                            <tbody>
                            {list.map(a => (
                                <tr key={a.id}>
                                    <td>{a.id}</td>
                                    <td><strong>{a.username}</strong></td>
                                    <td>
                                        {a.username !== currentUsername ? (
                                            <select
                                                value={a.role}
                                                onChange={e => handleRoleChange(a, e.target.value)}
                                                style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '8px',
                                                    border: '2px solid #d0dce8',
                                                    fontSize: '12px',
                                                    fontWeight: 700,
                                                    color: a.role === 'SUPER_ADMIN' ? '#856404' : '#4a90d9',
                                                    background: a.role === 'SUPER_ADMIN' ? '#fff3cd' : '#eef4fb',
                                                    cursor: 'pointer',
                                                    outline: 'none',
                                                }}
                                            >
                                                <option value="ADMIN">ADMIN</option>
                                                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                            </select>
                                        ) : (
                                            <span style={{
                                                background: a.role === 'SUPER_ADMIN' ? '#fff3cd' : '#eef4fb',
                                                color: a.role === 'SUPER_ADMIN' ? '#856404' : '#4a90d9',
                                                padding: '3px 10px', borderRadius: '20px',
                                                fontSize: '11px', fontWeight: 700
                                            }}>{a.role} <span style={{color:'#a0aebb'}}>(tu)</span></span>
                                        )}
                                    </td>
                                    <td>
                                        {a.username !== currentUsername ? (
                                            <button
                                                className="admin-delete-btn"
                                                onClick={() => { setSelected(a); setModal('delete'); }}
                                            >
                                                🗑️ Șterge
                                            </button>
                                        ) : (
                                            <span style={{fontSize:'12px',color:'#a0aebb',fontStyle:'italic'}}>—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
            </div>

            {modal === 'add' && (
                <div className="admin-modal-overlay" onClick={() => setModal(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="admin-modal-title">Adaugă Admin</h3>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Username</label>
                            <input className="admin-form-input" value={form.username}
                                   onChange={e => setForm(p => ({...p, username: e.target.value}))} />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Parolă (min 8 caractere)</label>
                            <input className="admin-form-input" type="password" value={form.password}
                                   onChange={e => setForm(p => ({...p, password: e.target.value}))} />
                        </div>
                        {error && <p style={{color:'#e05470',fontSize:'13px',margin:'0 0 16px'}}>{error}</p>}
                        <div className="admin-modal-actions">
                            <button className="admin-cancel-btn" onClick={() => setModal(null)}>Anulează</button>
                            <button className="admin-save-btn" onClick={handleCreate}>Creează</button>
                        </div>
                    </div>
                </div>
            )}

            {modal === 'delete' && (
                <div className="admin-modal-overlay" onClick={() => setModal(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="admin-modal-title">Șterge Admin</h3>
                        <p className="admin-confirm-text">Ești sigur că vrei să ștergi:</p>
                        <p className="admin-confirm-warning">„{selected?.username}"</p>
                        <div className="admin-modal-actions">
                            <button className="admin-cancel-btn" onClick={() => setModal(null)}>Anulează</button>
                            <button className="admin-delete-btn" onClick={handleDelete}>Șterge</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default AdminUsers;
