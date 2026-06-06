import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { authService } from '../../services/authService';

const EMPTY_FORM = { title: '', shortDescription: '', description: '', information: '', date: '', image: null };

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

function ConfirmCloseModal({ onConfirm, onCancel }) {
    return (
        <div className="admin-modal-overlay" style={{zIndex:300}} onClick={onCancel}>
            <div className="admin-modal" style={{maxWidth:'400px'}} onClick={e => e.stopPropagation()}>
                <h3 className="admin-modal-title">Părăsești fără salvare?</h3>
                <p style={{color:'#3a4a5c',fontSize:'15px',margin:'0 0 24px'}}>
                    Modificările nesalvate vor fi pierdute. Ești sigur că vrei să închizi?
                </p>
                <div className="admin-modal-actions">
                    <button className="admin-cancel-btn" onClick={onCancel}>Rămâi</button>
                    <button className="admin-delete-btn" onClick={onConfirm}>Închide fără salvare</button>
                </div>
            </div>
        </div>
    );
}

function AdminCompetitions() {
    const [list, setList] = useState([]);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(true);
    const [showConfirmClose, setShowConfirmClose] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const load = () => {
        authService.fetchWithAuth('/api/competition')
            .then(r => r.json()).then(setList)
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(EMPTY_FORM); setIsDirty(false); setModal('add'); };
    const openEdit = (c) => {
        setSelected(c);
        setForm({
            title: c.title, shortDescription: c.shortDescription,
            description: c.description, information: c.information || '',
            date: c.date ? c.date.substring(0, 16) : '',
            image: c.image || null,
        });
        setIsDirty(false);
        setModal('edit');
    };
    const openDelete = (c) => { setSelected(c); setModal('delete'); };

    const tryClose = () => {
        if (isDirty) setShowConfirmClose(true);
        else closeModal();
    };

    const closeModal = () => {
        setModal(null); setSelected(null);
        setShowConfirmClose(false); setIsDirty(false);
    };

    const handleSave = async () => {
        const url = modal === 'edit' ? `/api/competition/${selected.id}` : '/api/competition';
        const method = modal === 'edit' ? 'PUT' : 'POST';
        await authService.fetchWithAuth(url, { method, body: JSON.stringify(form) });
        closeModal(); load();
    };

    const handleDelete = async () => {
        await authService.fetchWithAuth(`/api/competition/${selected.id}`, { method: 'DELETE' });
        closeModal(); load();
    };

    const f = (k) => (e) => { setForm(p => ({ ...p, [k]: e.target.value })); setIsDirty(true); };

    const fieldLabels = { title: 'Titlu', shortDescription: 'Descriere scurtă', description: 'Descriere completă', information: 'Informații' };

    return (
        <AdminLayout title="Competiții">
            <div className="admin-page-header">
                <h2 className="admin-page-title">Toate Competițiile</h2>
                <button className="admin-add-btn" onClick={openAdd}>+ Adaugă Competiție</button>
            </div>

            <div className="admin-table-wrapper">
                {loading ? <p className="admin-empty">Se încarcă...</p> :
                    list.length === 0 ? <p className="admin-empty">Nu există competiții.</p> : (
                        <table className="admin-table">
                            <thead><tr><th>IMG</th><th>Titlu</th><th>Dată</th><th>Acțiuni</th></tr></thead>
                            <tbody>
                            {list.map(c => (
                                <tr key={c.id}>
                                    <td>
                                        {c.image
                                            ? <img className="admin-table-img" src={`data:image/jpeg;base64,${c.image}`} alt="" />
                                            : <div className="admin-table-placeholder">IMG</div>}
                                    </td>
                                    <td><strong>{c.title}</strong><br /><small style={{color:'#8a96a3'}}>{c.shortDescription?.substring(0,60)}...</small></td>
                                    <td>{c.date ? new Date(c.date).toLocaleDateString('ro-RO') : '—'}</td>
                                    <td>
                                        <div className="admin-actions">
                                            <button className="admin-edit-btn" onClick={() => openEdit(c)}>✏️ Edit</button>
                                            <button className="admin-delete-btn" onClick={() => openDelete(c)}>🗑️ Șterge</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
            </div>

            {(modal === 'add' || modal === 'edit') && (
                <div className="admin-modal-overlay" onClick={tryClose}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="admin-modal-title">{modal === 'add' ? 'Adaugă Competiție' : 'Editează Competiție'}</h3>
                        {Object.entries(fieldLabels).map(([k, label]) => (
                            <div className="admin-form-group" key={k}>
                                <label className="admin-form-label">{label}</label>
                                {k === 'description' || k === 'information'
                                    ? <textarea className="admin-form-textarea" value={form[k]} onChange={f(k)} />
                                    : <input className="admin-form-input" value={form[k]} onChange={f(k)} />}
                            </div>
                        ))}
                        <div className="admin-form-group">
                            <label className="admin-form-label">Data și ora</label>
                            <input className="admin-form-input" type="datetime-local"
                                   value={form.date} onChange={f('date')} />
                        </div>
                        <ImageField value={form.image} onChange={(b64) => { setForm(p => ({...p, image: b64})); setIsDirty(true); }} />
                        <div className="admin-modal-actions">
                            <button className="admin-cancel-btn" onClick={tryClose}>Anulează</button>
                            <button className="admin-save-btn" onClick={handleSave}>Salvează</button>
                        </div>
                    </div>
                </div>
            )}

            {showConfirmClose && (
                <ConfirmCloseModal onConfirm={closeModal} onCancel={() => setShowConfirmClose(false)} />
            )}

            {modal === 'delete' && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="admin-modal-title">Șterge Competiția</h3>
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

export default AdminCompetitions;