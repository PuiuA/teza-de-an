import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { authService } from '../../services/authService';

const EMPTY_FORM = { name: '', club: '', birthYear: '', weightKg: '', belt: '', photo: null };

const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

const belts = ['Centura Alba', 'Centura Galbena', 'Centura Portocalie', 'Centura Verde', 'Centura Albastra', 'Centura Maro', 'Centura Neagra'];

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

function AdminAthletes() {
    const [list, setList] = useState([]);
    const [modal, setModal] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(true);
    const [showConfirmClose, setShowConfirmClose] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const load = () => {
        authService.fetchWithAuth('/api/athletes')
            .then(r => r.json()).then(setList)
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(EMPTY_FORM); setIsDirty(false); setModal('add'); };
    const openEdit = (a) => {
        setSelected(a);
        setForm({ name: a.name, club: a.club || '', birthYear: a.birthYear || '',
            weightKg: a.weightKg || '', belt: a.belt || '', photo: a.photo || null });
        setIsDirty(false);
        setModal('edit');
    };
    const openDelete = (a) => { setSelected(a); setModal('delete'); };

    const tryClose = () => {
        if (isDirty) setShowConfirmClose(true);
        else closeModal();
    };

    const closeModal = () => {
        setModal(null); setSelected(null);
        setShowConfirmClose(false); setIsDirty(false);
    };

    const handleSave = async () => {
        const url = modal === 'edit' ? `/api/athletes/${selected.id}` : '/api/athletes';
        const method = modal === 'edit' ? 'PUT' : 'POST';
        await authService.fetchWithAuth(url, { method, body: JSON.stringify(form) });
        closeModal(); load();
    };

    const handleDelete = async () => {
        await authService.fetchWithAuth(`/api/athletes/${selected.id}`, { method: 'DELETE' });
        closeModal(); load();
    };

    const f = (k) => (e) => { setForm(p => ({ ...p, [k]: e.target.value })); setIsDirty(true); };

    return (
        <AdminLayout title="Sportivi">
            <div className="admin-page-header">
                <h2 className="admin-page-title">Toți Sportivii</h2>
                <button className="admin-add-btn" onClick={openAdd}>+ Adaugă Sportiv</button>
            </div>

            <div className="admin-table-wrapper">
                {loading ? <p className="admin-empty">Se încarcă...</p> :
                    list.length === 0 ? <p className="admin-empty">Nu există sportivi.</p> : (
                        <table className="admin-table">
                            <thead><tr><th>Foto</th><th>Nume</th><th>Club</th><th>An</th><th>Greutate</th><th>Centură</th><th>Acțiuni</th></tr></thead>
                            <tbody>
                            {list.map(a => (
                                <tr key={a.id}>
                                    <td>
                                        {a.photo
                                            ? <img className="admin-table-img" src={`data:image/jpeg;base64,${a.photo}`} alt=""
                                                   style={{borderRadius:'50%',width:'36px',height:'36px'}} />
                                            : <div className="admin-table-placeholder"
                                                   style={{borderRadius:'50%',width:'36px',height:'36px',fontSize:'14px',
                                                       fontWeight:700,background:'linear-gradient(135deg,#4a90d9,#1a2535)',color:'#fff'}}>
                                                {a.name?.charAt(0)}
                                            </div>}
                                    </td>
                                    <td><strong>{a.name}</strong></td>
                                    <td>{a.club || '—'}</td>
                                    <td>{a.birthYear || '—'}</td>
                                    <td>{a.weightKg ? `${a.weightKg} kg` : '—'}</td>
                                    <td>{a.belt || '—'}</td>
                                    <td>
                                        <div className="admin-actions">
                                            <button className="admin-edit-btn" onClick={() => openEdit(a)}>✏️ Edit</button>
                                            <button className="admin-delete-btn" onClick={() => openDelete(a)}>🗑️ Șterge</button>
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
                        <h3 className="admin-modal-title">{modal === 'add' ? 'Adaugă Sportiv' : 'Editează Sportiv'}</h3>
                        <div className="admin-form-group"><label className="admin-form-label">Nume</label><input className="admin-form-input" value={form.name} onChange={f('name')} /></div>
                        <div className="admin-form-group"><label className="admin-form-label">Club</label><input className="admin-form-input" value={form.club} onChange={f('club')} /></div>
                        <div className="admin-form-group"><label className="admin-form-label">An naștere</label><input className="admin-form-input" type="number" value={form.birthYear} onChange={f('birthYear')} /></div>
                        <div className="admin-form-group"><label className="admin-form-label">Greutate (kg)</label><input className="admin-form-input" type="number" step="0.1" value={form.weightKg} onChange={f('weightKg')} /></div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Centură</label>
                            <select className="admin-form-select" value={form.belt} onChange={f('belt')}>
                                <option value="">— Selectează —</option>
                                {belts.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Fotografie</label>
                            <input type="file" accept="image/*" className="admin-form-input"
                                   onChange={async (e) => {
                                       const file = e.target.files[0];
                                       if (file) {
                                           const b64 = await toBase64(file);
                                           setForm(p => ({...p, photo: b64}));
                                           setIsDirty(true);
                                       }
                                   }} />
                            {form.photo && (
                                <div style={{display:'flex',alignItems:'center',gap:'12px',marginTop:'8px'}}>
                                    <img src={`data:image/jpeg;base64,${form.photo}`} alt="preview"
                                         style={{width:'60px',height:'60px',objectFit:'cover',borderRadius:'50%',border:'3px solid #e8edf4'}} />
                                    <span style={{fontSize:'12px',color:'#6b7a8d'}}>Preview fotografie</span>
                                </div>
                            )}
                        </div>
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
                        <h3 className="admin-modal-title">Șterge Sportivul</h3>
                        <p className="admin-confirm-text">Ești sigur că vrei să ștergi:</p>
                        <p className="admin-confirm-warning">„{selected?.name}"</p>
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

export default AdminAthletes;