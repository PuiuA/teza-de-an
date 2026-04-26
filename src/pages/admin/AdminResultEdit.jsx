import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { authService } from '../../services/authService';

function AdminResultEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [result, setResult] = useState(null);
    const [allCategories, setAllCategories] = useState([]);
    const [allAthletes, setAllAthletes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search states
    const [categorySearch, setCategorySearch] = useState('');
    const [athleteSearch, setAthleteSearch] = useState('');

    // Modal states
    const [modal, setModal] = useState(null);
    const [selectedCatResult, setSelectedCatResult] = useState(null);
    const [selectedAthleteResult, setSelectedAthleteResult] = useState(null);

    // Add athlete form
    const [addAthleteForm, setAddAthleteForm] = useState({ athleteId: '', place: '' });
    const [newAthleteForm, setNewAthleteForm] = useState({ name: '', club: '', birthYear: '' });
    const [addAthleteTab, setAddAthleteTab] = useState('existing'); // 'existing' | 'new'

    // Add category form
    const [selectedCategoryId, setSelectedCategoryId] = useState('');

    const loadResult = () => {
        authService.fetchWithAuth(`/api/results/${id}`)
            .then(r => r.json()).then(setResult)
            .finally(() => setLoading(false));
    };

    const loadCategories = () => {
        authService.fetchWithAuth('/api/category')
            .then(r => r.json()).then(setAllCategories);
    };

    const loadAthletes = () => {
        authService.fetchWithAuth('/api/athletes')
            .then(r => r.json()).then(setAllAthletes);
    };

    useEffect(() => {
        loadResult();
        loadCategories();
        loadAthletes();
    }, [id]);

    // ── Handlers ──

    const handleAddCategory = async () => {
        if (!selectedCategoryId) return;
        await authService.fetchWithAuth('/api/category-result', {
            method: 'POST',
            body: JSON.stringify({ resultId: parseInt(id), categoryId: parseInt(selectedCategoryId) }),
        });
        setModal(null);
        setSelectedCategoryId('');
        loadResult();
    };

    const handleDeleteCategory = async (catResultId) => {
        if (!window.confirm('Ștergi această categorie și toți sportivii din ea?')) return;
        await authService.fetchWithAuth(`/api/category-result/${catResultId}`, { method: 'DELETE' });
        loadResult();
    };

    const openAddAthlete = (catResult) => {
        setSelectedCatResult(catResult);
        setAddAthleteForm({ athleteId: '', place: '' });
        setNewAthleteForm({ name: '', club: '', birthYear: '' });
        setAthleteSearch('');
        setAddAthleteTab('existing');
        setModal('addAthlete');
    };

    const handleAddExistingAthlete = async () => {
        if (!addAthleteForm.athleteId || !addAthleteForm.place) return;
        await authService.fetchWithAuth(
            `/api/category-result/${selectedCatResult.id}/athlete`, {
                method: 'POST',
                body: JSON.stringify({
                    athleteId: parseInt(addAthleteForm.athleteId),
                    place: parseInt(addAthleteForm.place),
                }),
            });
        setModal(null);
        loadResult();
        loadAthletes();
    };

    const handleAddNewAthlete = async () => {
        if (!newAthleteForm.name || !addAthleteForm.place) return;
        // Creeaza sportiv nou
        const res = await authService.fetchWithAuth('/api/athletes', {
            method: 'POST',
            body: JSON.stringify(newAthleteForm),
        });
        const newAthlete = await res.json();
        // Adauga la categorie
        await authService.fetchWithAuth(
            `/api/category-result/${selectedCatResult.id}/athlete`, {
                method: 'POST',
                body: JSON.stringify({
                    athleteId: newAthlete.id,
                    place: parseInt(addAthleteForm.place),
                }),
            });
        setModal(null);
        loadResult();
        loadAthletes();
    };

    const handleRemoveAthlete = async (athleteResultId) => {
        await authService.fetchWithAuth(
            `/api/category-result/athlete/${athleteResultId}`, { method: 'DELETE' });
        loadResult();
    };

    const getMedal = (place) => {
        if (place === 1) return '🥇';
        if (place === 2) return '🥈';
        if (place === 3 || place === 4) return '🥉';
        return `#${place}`;
    };

    // Filtrare categorii disponibile (care nu sunt deja adăugate)
    const usedCategoryIds = result?.categoryResults?.map(cr => cr.category.id) || [];
    const availableCategories = allCategories
        .filter(c => !usedCategoryIds.includes(c.id))
        .filter(c => {
            if (!categorySearch) return true;
            return `${c.gender} ${c.kilograms}`.toLowerCase().includes(categorySearch.toLowerCase());
        });

    // Filtrare sportivi
    const filteredAthletes = allAthletes.filter(a => {
        if (!athleteSearch) return true;
        return a.name.toLowerCase().includes(athleteSearch.toLowerCase()) ||
            (a.club || '').toLowerCase().includes(athleteSearch.toLowerCase());
    });

    if (loading) return (
        <AdminLayout title="Editare Rezultat">
            <p style={{textAlign:'center',padding:'60px',color:'#8a96a3'}}>Se încarcă...</p>
        </AdminLayout>
    );

    return (
        <AdminLayout title="Editare Rezultat">
            {/* Header */}
            <div className="admin-page-header">
                <div>
                    <button
                        onClick={() => navigate('/admin/results')}
                        style={{background:'none',border:'none',color:'#4a90d9',fontWeight:700,
                            fontSize:'13px',cursor:'pointer',letterSpacing:'1px',
                            textTransform:'uppercase',marginBottom:'8px',padding:0}}
                    >
                        ← Înapoi la Rezultate
                    </button>
                    <h2 className="admin-page-title">{result?.title}</h2>
                    <span style={{background:'#eef4fb',color:'#4a90d9',padding:'4px 12px',
                        borderRadius:'20px',fontSize:'12px',fontWeight:700}}>
                        {result?.year} · U{result?.age}
                    </span>
                </div>
                <button className="admin-add-btn" onClick={() => setModal('addCategory')}>
                    + Adaugă Categorie
                </button>
            </div>

            {/* Categories */}
            {result?.categoryResults?.length === 0 ? (
                <div className="admin-empty" style={{background:'#fff',borderRadius:'12px',padding:'60px',
                    border:'2px dashed #d0dce8'}}>
                    Nu există categorii. Adaugă prima categorie!
                </div>
            ) : (
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:'20px'}}>
                    {result?.categoryResults?.map(cr => (
                        <div key={cr.id} style={{background:'#fff',borderRadius:'12px',
                            boxShadow:'0 2px 12px rgba(0,0,0,0.06)',
                            overflow:'hidden'}}>
                            {/* Category header */}
                            <div style={{background:'#1a2535',padding:'14px 18px',
                                display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                                <span style={{color:'#fff',fontWeight:700,fontSize:'14px'}}>
                                    {cr.category.gender} · {cr.category.kilograms}
                                </span>
                                <div style={{display:'flex',gap:'8px'}}>
                                    <button
                                        onClick={() => openAddAthlete(cr)}
                                        style={{background:'#4a90d9',color:'#fff',border:'none',
                                            borderRadius:'6px',padding:'5px 12px',fontSize:'12px',
                                            fontWeight:700,cursor:'pointer'}}
                                    >
                                        + Sportiv
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(cr.id)}
                                        style={{background:'rgba(224,84,112,0.2)',color:'#ff6b7a',
                                            border:'none',borderRadius:'6px',padding:'5px 10px',
                                            fontSize:'12px',cursor:'pointer'}}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            {/* Athletes list */}
                            <div style={{padding:'12px'}}>
                                {cr.athleteResults?.length === 0 ? (
                                    <p style={{textAlign:'center',color:'#a0aebb',fontSize:'13px',
                                        fontStyle:'italic',padding:'16px 0',margin:0}}>
                                        Fără sportivi
                                    </p>
                                ) : (
                                    cr.athleteResults
                                        .sort((a,b) => a.place - b.place)
                                        .map(ar => (
                                            <div key={ar.id} style={{
                                                display:'flex',alignItems:'center',gap:'10px',
                                                padding:'8px 10px',borderRadius:'8px',
                                                marginBottom:'4px',
                                                background: ar.place === 1 ? 'rgba(212,160,23,0.08)' :
                                                    ar.place === 2 ? 'rgba(138,155,181,0.08)' :
                                                        ar.place <= 4 ? 'rgba(192,120,64,0.08)' : '#f9fbfd'
                                            }}>
                                                <span style={{fontSize:'18px',minWidth:'26px'}}>
                                                    {getMedal(ar.place)}
                                                </span>
                                                <div style={{flex:1,minWidth:0}}>
                                                    <p style={{margin:0,fontWeight:700,fontSize:'13px',color:'#1a2535'}}>
                                                        {ar.athleteName}
                                                    </p>
                                                    {ar.athleteClub && (
                                                        <p style={{margin:0,fontSize:'11px',color:'#8a96a3'}}>
                                                            {ar.athleteClub}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveAthlete(ar.id)}
                                                    style={{background:'none',border:'none',color:'#e05470',
                                                        cursor:'pointer',fontSize:'14px',padding:'2px 6px',
                                                        borderRadius:'4px',flexShrink:0}}
                                                    title="Elimină"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Modal: Add Category ── */}
            {modal === 'addCategory' && (
                <div className="admin-modal-overlay" onClick={() => setModal(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="admin-modal-title">Adaugă Categorie</h3>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Caută categorie</label>
                            <input
                                className="admin-form-input"
                                placeholder="ex: F 52kg, M 66kg..."
                                value={categorySearch}
                                onChange={e => setCategorySearch(e.target.value)}
                            />
                        </div>

                        <div style={{maxHeight:'260px',overflowY:'auto',border:'2px solid #d0dce8',
                            borderRadius:'8px',marginBottom:'16px'}}>
                            {availableCategories.length === 0 ? (
                                <p style={{textAlign:'center',padding:'20px',color:'#a0aebb',
                                    fontSize:'13px',fontStyle:'italic'}}>
                                    {categorySearch ? 'Nicio categorie găsită' : 'Toate categoriile sunt deja adăugate'}
                                </p>
                            ) : (
                                availableCategories.map(c => (
                                    <div
                                        key={c.id}
                                        onClick={() => setSelectedCategoryId(String(c.id))}
                                        style={{
                                            padding:'10px 14px',cursor:'pointer',
                                            background: selectedCategoryId === String(c.id) ? '#eef4fb' : 'transparent',
                                            borderLeft: selectedCategoryId === String(c.id) ? '3px solid #4a90d9' : '3px solid transparent',
                                            display:'flex',alignItems:'center',gap:'10px'
                                        }}
                                    >
                                        <span style={{fontWeight:700,color:'#4a90d9',minWidth:'20px'}}>
                                            {c.gender}
                                        </span>
                                        <span style={{color:'#1a2535',fontWeight:600}}>{c.kilograms}</span>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="admin-modal-actions">
                            <button className="admin-cancel-btn" onClick={() => setModal(null)}>Anulează</button>
                            <button
                                className="admin-save-btn"
                                onClick={handleAddCategory}
                                disabled={!selectedCategoryId}
                                style={{opacity: selectedCategoryId ? 1 : 0.5}}
                            >
                                Adaugă
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal: Add Athlete ── */}
            {modal === 'addAthlete' && (
                <div className="admin-modal-overlay" onClick={() => setModal(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="admin-modal-title">
                            Adaugă Sportiv — {selectedCatResult?.category?.gender} {selectedCatResult?.category?.kilograms}
                        </h3>

                        {/* Tabs */}
                        <div style={{display:'flex',gap:'8px',marginBottom:'20px'}}>
                            {['existing','new'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setAddAthleteTab(tab)}
                                    style={{
                                        flex:1, padding:'9px', border:'none', borderRadius:'8px',
                                        fontWeight:700, fontSize:'13px', cursor:'pointer',
                                        background: addAthleteTab === tab ? '#4a90d9' : '#f0f2f5',
                                        color: addAthleteTab === tab ? '#fff' : '#6b7a8d',
                                    }}
                                >
                                    {tab === 'existing' ? '🔍 Sportiv existent' : '➕ Sportiv nou'}
                                </button>
                            ))}
                        </div>

                        {/* Loc */}
                        <div className="admin-form-group">
                            <label className="admin-form-label">Locul ocupat</label>
                            <select
                                className="admin-form-select"
                                value={addAthleteForm.place}
                                onChange={e => setAddAthleteForm(p => ({...p, place: e.target.value}))}
                            >
                                <option value="">— Selectează locul —</option>
                                {[1,2,3,4,5,6,7,8].map(i => (
                                    <option key={i} value={i}>
                                        {i === 1 ? '🥇 Locul 1' :
                                            i === 2 ? '🥈 Locul 2' :
                                                i === 3 ? '🥉 Locul 3 (Bronz)' :
                                                    i === 4 ? '🥉 Locul 3 (Bronz)' :
                                                        `Locul ${i}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {addAthleteTab === 'existing' ? (
                            <>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Caută sportiv</label>
                                    <input
                                        className="admin-form-input"
                                        placeholder="Nume sau club..."
                                        value={athleteSearch}
                                        onChange={e => setAthleteSearch(e.target.value)}
                                    />
                                </div>
                                <div style={{maxHeight:'220px',overflowY:'auto',border:'2px solid #d0dce8',
                                    borderRadius:'8px',marginBottom:'16px'}}>
                                    {filteredAthletes.length === 0 ? (
                                        <p style={{textAlign:'center',padding:'20px',color:'#a0aebb',
                                            fontSize:'13px',fontStyle:'italic'}}>
                                            Niciun sportiv găsit
                                        </p>
                                    ) : filteredAthletes.map(a => (
                                        <div
                                            key={a.id}
                                            onClick={() => setAddAthleteForm(p => ({...p, athleteId: String(a.id)}))}
                                            style={{
                                                padding:'10px 14px', cursor:'pointer',
                                                background: addAthleteForm.athleteId === String(a.id) ? '#eef4fb' : 'transparent',
                                                borderLeft: addAthleteForm.athleteId === String(a.id) ? '3px solid #4a90d9' : '3px solid transparent',
                                            }}
                                        >
                                            <p style={{margin:0,fontWeight:700,fontSize:'13px',color:'#1a2535'}}>{a.name}</p>
                                            {a.club && <p style={{margin:0,fontSize:'11px',color:'#8a96a3'}}>{a.club}</p>}
                                        </div>
                                    ))}
                                </div>
                                <div className="admin-modal-actions">
                                    <button className="admin-cancel-btn" onClick={() => setModal(null)}>Anulează</button>
                                    <button
                                        className="admin-save-btn"
                                        onClick={handleAddExistingAthlete}
                                        disabled={!addAthleteForm.athleteId || !addAthleteForm.place}
                                        style={{opacity: addAthleteForm.athleteId && addAthleteForm.place ? 1 : 0.5}}
                                    >
                                        Adaugă
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Nume *</label>
                                    <input className="admin-form-input" value={newAthleteForm.name}
                                           onChange={e => setNewAthleteForm(p => ({...p, name: e.target.value}))}
                                           placeholder="Prenume Nume" />
                                </div>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Club</label>
                                    <input className="admin-form-input" value={newAthleteForm.club}
                                           onChange={e => setNewAthleteForm(p => ({...p, club: e.target.value}))}
                                           placeholder="CS Olimpia Chișinău" />
                                </div>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">An naștere</label>
                                    <input className="admin-form-input" type="number"
                                           value={newAthleteForm.birthYear}
                                           onChange={e => setNewAthleteForm(p => ({...p, birthYear: e.target.value}))}
                                           placeholder="2007" />
                                </div>
                                <div className="admin-modal-actions">
                                    <button className="admin-cancel-btn" onClick={() => setModal(null)}>Anulează</button>
                                    <button
                                        className="admin-save-btn"
                                        onClick={handleAddNewAthlete}
                                        disabled={!newAthleteForm.name || !addAthleteForm.place}
                                        style={{opacity: newAthleteForm.name && addAthleteForm.place ? 1 : 0.5}}
                                    >
                                        Creează și Adaugă
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default AdminResultEdit;