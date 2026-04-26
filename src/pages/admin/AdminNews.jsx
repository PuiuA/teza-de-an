import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { authService } from '../../services/authService';

const EMPTY_FORM = {
    title: '', shortDescription: '', description: '',
    author: '', information: '', eventTypeId: 1, image: null,
};

const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

function ImageField({ value, onChange }) {
    return (
        <div className="admin-form-group">
            <label className="admin-form-label">Imagine</label>
            <input type="file" accept="image/*" className="admin-form-input"
                   onChange={async (e) => {
                       const file = e.target.files[0];
                       if (file) onChange(await toBase64(file));
                   }} />
            {value && (
                <img src={`data:image/jpeg;base64,${value}`} alt="preview"
                     style={{width:'100%',maxHeight:'140px',objectFit:'cover',borderRadius:'8px',marginTop:'8px'}} />
            )}
        </div>
    );
}

function AdminNews() {
    const [newsList, setNewsList] = useState([]);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(true);

    const load = () => {
        authService.fetchWithAuth('/api/news')
            .then(r => r.json()).then(setNewsList)
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(EMPTY_FORM); setModal('add'); };
    const openEdit = (n) => {
        setSelected(n);
        setForm({
            title: n.title, shortDescription: n.shortDescription,
            description: n.description, author: n.author || '',
            information: n.information || '', eventTypeId: n.eventType?.id || 1,
            image: n.image || null,
        });
        setModal('edit');
    };
    const openDelete = (n) => { setSelected(n); setModal('delete'); };
    const closeModal = () => { setModal(null); setSelected(null); };

    const handleSave = async () => {
        const payload = { ...form, published: new Date().toISOString() };
        const url = modal === 'edit' ? `/api/news/${selected.id}` : '/api/news';
        const method = modal === 'edit' ? 'PUT' : 'POST';
        await authService.fetchWithAuth(url, { method, body: JSON.stringify(payload) });
        closeModal(); load();
    };

    const handleDelete = async () => {
        await authService.fetchWithAuth(`/api/news/${selected.id}`, { method: 'DELETE' });
        closeModal(); load();
    };

    const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

    return (
        <AdminLayout title="Știri">
            <div className="admin-page-header">
                <h2 className="admin-page-title">Toate Știrile</h2>
                <button className="admin-add-btn" onClick={openAdd}>+ Adaugă Știre</button>
            </div>

            <div className="admin-table-wrapper">
                {loading ? <p className="admin-empty">Se încarcă...</p> :
                    newsList.length === 0 ? <p className="admin-empty">Nu există știri.</p> : (
                        <table className="admin-table">
                            <thead>
                            <tr><th>IMG</th><th>Titlu</th><th>Autor</th><th>Publicat</th><th>Tip</th><th>Acțiuni</th></tr>
                            </thead>
                            <tbody>
                            {newsList.map(n => (
                                <tr key={n.id}>
                                    <td>
                                        {n.image
                                            ? <img className="admin-table-img" src={`data:image/jpeg;base64,${n.image}`} alt="" />
                                            : <div className="admin-table-placeholder">IMG</div>}
                                    </td>
                                    <td><strong>{n.title}</strong></td>
                                    <td>{n.author || '—'}</td>
                                    <td>{n.published ? new Date(n.published).toLocaleDateString('ro-RO') : '—'}</td>
                                    <td>{n.eventType?.eventType || '—'}</td>
                                    <td>
                                        <div className="admin-actions">
                                            <button className="admin-edit-btn" onClick={() => openEdit(n)}>✏️ Edit</button>
                                            <button className="admin-delete-btn" onClick={() => openDelete(n)}>🗑️ Șterge</button>
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
                        <h3 className="admin-modal-title">{modal === 'add' ? 'Adaugă Știre' : 'Editează Știre'}</h3>
                        <div className="admin-form-group"><label className="admin-form-label">Titlu</label><input className="admin-form-input" value={form.title} onChange={f('title')} /></div>
                        <div className="admin-form-group"><label className="admin-form-label">Descriere scurtă</label><textarea className="admin-form-textarea" value={form.shortDescription} onChange={f('shortDescription')} /></div>
                        <div className="admin-form-group"><label className="admin-form-label">Descriere completă</label><textarea className="admin-form-textarea" style={{minHeight:'140px'}} value={form.description} onChange={f('description')} /></div>
                        <div className="admin-form-group"><label className="admin-form-label">Autor</label><input className="admin-form-input" value={form.author} onChange={f('author')} /></div>
                        <div className="admin-form-group"><label className="admin-form-label">Informații suplimentare</label><textarea className="admin-form-textarea" value={form.information} onChange={f('information')} /></div>
                        <ImageField value={form.image} onChange={(b64) => setForm(p => ({...p, image: b64}))} />
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
                        <h3 className="admin-modal-title">Șterge Știrea</h3>
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

export default AdminNews;