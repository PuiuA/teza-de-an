import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { authService } from '../../services/authService';

const EMPTY_FORM = { title: '', year: '', age: '' };

function AdminResults() {
    const [list, setList] = useState([]);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const load = () => {
        authService.fetchWithAuth('/api/results')
            .then(r => r.json()).then(setList)
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(EMPTY_FORM); setModal('add'); };
    const openEdit = (r) => { setSelected(r); setForm({ title: r.title, year: r.year || '', age: r.age || '' }); setModal('edit'); };
    const openDelete = (r) => { setSelected(r); setModal('delete'); };
    const closeModal = () => { setModal(null); setSelected(null); };

    const handleSave = async () => {
        const url = modal === 'edit' ? `/api/results/${selected.id}` : '/api/results';
        const method = modal === 'edit' ? 'PUT' : 'POST';
        await authService.fetchWithAuth(url, { method, body: JSON.stringify({ ...form, age: parseInt(form.age) }) });
        closeModal(); load();
    };

    const handleDelete = async () => {
        await authService.fetchWithAuth(`/api/results/${selected.id}`, { method: 'DELETE' });
        closeModal(); load();
    };

    const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

    const getAgeLabel = (age) => {
        if (age === 18) return 'U18 · Cadeți';
        if (age === 21) return 'U21 · Juniori';
        if (age === 15) return 'U15 · Copii';
        return `U${age}`;
    };

    return (
        <AdminLayout title="Rezultate">
            <div className="admin-page-header">
                <h2 className="admin-page-title">Toate Rezultatele</h2>
                <button className="admin-add-btn" onClick={openAdd}>+ Adaugă Rezultat</button>
            </div>

            <div className="admin-table-wrapper">
                {loading ? <p className="admin-empty">Se încarcă...</p> :
                    list.length === 0 ? <p className="admin-empty">Nu există rezultate.</p> : (
                        <table className="admin-table">
                            <thead>
                            <tr><th>Titlu</th><th>An</th><th>Categorie Vârstă</th><th>Categorii</th><th>Acțiuni</th></tr>
                            </thead>
                            <tbody>
                            {list.map(r => (
                                <tr key={r.id}>
                                    <td><strong>{r.title}</strong></td>
                                    <td>{r.year || '—'}</td>
                                    <td>
                                            <span style={{background:'#eef4fb',color:'#4a90d9',padding:'3px 10px',borderRadius:'20px',fontSize:'12px',fontWeight:700}}>
                                                {getAgeLabel(r.age)}
                                            </span>
                                    </td>
                                    <td>
                                            <span style={{color:'#6b7a8d',fontSize:'13px'}}>
                                                {r.categoryResults?.length || 0} categorii
                                            </span>
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            <button
                                                className="admin-edit-btn"
                                                onClick={() => navigate(`/admin/results/${r.id}/edit`)}
                                                style={{background:'#e8f4e8',color:'#28a745'}}
                                            >
                                                🏅 Categorii
                                            </button>
                                            <button className="admin-edit-btn" onClick={() => openEdit(r)}>✏️ Edit</button>
                                            <button className="admin-delete-btn" onClick={() => openDelete(r)}>🗑️ Șterge</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
            </div>

            {(modal === 'add' || modal === 'edit') && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="admin-modal-title">{modal === 'add' ? 'Adaugă Rezultat' : 'Editează Rezultat'}</h3>
                        <div className="admin-form-group"><label className="admin-form-label">Titlu</label><input className="admin-form-input" value={form.title} onChange={f('title')} placeholder="Naționale 2025 - U18" /></div>
                        <div className="admin-form-group"><label className="admin-form-label">An</label><input className="admin-form-input" value={form.year} onChange={f('year')} placeholder="2025" /></div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Categorie vârstă</label>
                            <select className="admin-form-select" value={form.age} onChange={f('age')}>
                                <option value="">— Selectează —</option>
                                <option value="15">U15 · Copii</option>
                                <option value="18">U18 · Cadeți</option>
                                <option value="21">U21 · Juniori</option>
                                <option value="23">U23 · Tineret</option>
                            </select>
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-cancel-btn" onClick={closeModal}>Anulează</button>
                            <button className="admin-save-btn" onClick={handleSave}>Salvează</button>
                        </div>
                    </div>
                </div>
            )}

            {modal === 'delete' && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="admin-modal-title">Șterge Rezultatul</h3>
                        <p className="admin-confirm-text">Ești sigur că vrei să ștergi:</p>
                        <p className="admin-confirm-warning">„{selected?.title}"</p>
                        <div className="admin-modal-actions">
                            <button className="admin-cancel-btn" onClick={closeModal}>Anulează</button>
                            <button className="admin-delete-btn" onClick={handleDelete}>Șterge</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default AdminResults;