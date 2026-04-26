import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { authService } from '../../services/authService';

const EMPTY_FORM = { title: '', link: '', image: null };

const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

function AdminSponsors() {
    const [list, setList] = useState([]);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(true);

    const load = () => {
        authService.fetchWithAuth('/api/sponsors')
            .then(r => r.json()).then(setList)
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(EMPTY_FORM); setModal('add'); };
    const openEdit = (s) => {
        setSelected(s);
        setForm({ title: s.title || '', link: s.link || '', image: s.image || null });
        setModal('edit');
    };
    const openDelete = (s) => { setSelected(s); setModal('delete'); };
    const closeModal = () => { setModal(null); setSelected(null); };

    const handleSave = async () => {
        const url = modal === 'edit' ? `/api/sponsors/${selected.id}` : '/api/sponsors';
        const method = modal === 'edit' ? 'PUT' : 'POST';
        await authService.fetchWithAuth(url, { method, body: JSON.stringify(form) });
        closeModal(); load();
    };

    const handleDelete = async () => {
        await authService.fetchWithAuth(`/api/sponsors/${selected.id}`, { method: 'DELETE' });
        closeModal(); load();
    };

    const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

    return (
        <AdminLayout title="Sponsori">
            <div className="admin-page-header">
                <h2 className="admin-page-title">Toți Sponsorii</h2>
                <button className="admin-add-btn" onClick={openAdd}>+ Adaugă Sponsor</button>
            </div>

            <div className="admin-table-wrapper">
                {loading ? <p className="admin-empty">Se încarcă...</p> :
                    list.length === 0 ? <p className="admin-empty">Nu există sponsori.</p> : (
                        <table className="admin-table">
                            <thead><tr><th>Logo</th><th>Nume</th><th>Link</th><th>Acțiuni</th></tr></thead>
                            <tbody>
                            {list.map(s => (
                                <tr key={s.id}>
                                    <td>
                                        {s.image
                                            ? <img className="admin-table-img" src={`data:image/jpeg;base64,${s.image}`} alt=""
                                                   style={{objectFit:'contain',background:'#f5f8fc'}} />
                                            : <div className="admin-table-placeholder">LOGO</div>}
                                    </td>
                                    <td><strong>{s.title || '—'}</strong></td>
                                    <td><a href={s.link} target="_blank" rel="noreferrer"
                                           style={{color:'#4a90d9',fontSize:'13px'}}>{s.link || '—'}</a></td>
                                    <td>
                                        <div className="admin-actions">
                                            <button className="admin-edit-btn" onClick={() => openEdit(s)}>✏️ Edit</button>
                                            <button className="admin-delete-btn" onClick={() => openDelete(s)}>🗑️ Șterge</button>
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
                        <h3 className="admin-modal-title">{modal === 'add' ? 'Adaugă Sponsor' : 'Editează Sponsor'}</h3>
                        <div className="admin-form-group"><label className="admin-form-label">Nume</label><input className="admin-form-input" value={form.title} onChange={f('title')} /></div>
                        <div className="admin-form-group"><label className="admin-form-label">Link website</label><input className="admin-form-input" value={form.link} onChange={f('link')} placeholder="https://..." /></div>
                        {/* Logo upload */}
                        <div className="admin-form-group">
                            <label className="admin-form-label">Logo</label>
                            <input type="file" accept="image/*" className="admin-form-input"
                                   onChange={async (e) => {
                                       const file = e.target.files[0];
                                       if (file) {
                                           const b64 = await toBase64(file);
                                           setForm(p => ({...p, image: b64}));
                                       }
                                   }} />
                            {form.image && (
                                <img src={`data:image/jpeg;base64,${form.image}`} alt="preview"
                                     style={{maxHeight:'80px',maxWidth:'200px',objectFit:'contain',
                                         marginTop:'8px',borderRadius:'8px',background:'#f5f8fc',padding:'8px'}} />
                            )}
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
                        <h3 className="admin-modal-title">Șterge Sponsorul</h3>
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

export default AdminSponsors;