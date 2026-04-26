import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './css/Athletes.css';
import API from "../config/api.js";

function Athletes() {
    const [athletes, setAthletes] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchAthletes = (currentPage = 0, currentSearch = search) => {
        setLoading(true);
        const params = new URLSearchParams({ page: currentPage, size: 8 });
        if (currentSearch.trim()) params.append('name', currentSearch.trim());

        fetch(`${API}/api/athletes/paginated?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                setAthletes(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(err => console.error('Error:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchAthletes(page, search);
    }, [page]);

    const handleSearch = () => {
        setPage(0);
        fetchAthletes(0, search);
    };

    const handleClear = () => {
        setSearch('');
        setPage(0);
        fetchAthletes(0, '');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="athletes-page">
            <h2 className="page-title">Sportivi</h2>

            <div className="filters">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder="Caută după nume..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {search && (
                        <button className="clear-btn" onClick={handleClear} title="Șterge">✕</button>
                    )}
                </div>
                <button onClick={handleSearch}>Caută</button>
            </div>

            {loading ? (
                <p className="results-loading">Se încarcă...</p>
            ) : athletes.length === 0 ? (
                <div className="no-div">Nu au fost găsiți sportivi</div>
            ) : (
                <div className="athletes-grid">
                    {athletes.map(athlete => (
                        <Link key={athlete.id} to={`/athletes/${athlete.id}`} className="athlete-card-link">
                            <div className="athlete-card">
                                <div className="athlete-photo">
                                    {athlete.photo ? (
                                        <img src={`data:image/jpeg;base64,${athlete.photo}`} alt={athlete.name} />
                                    ) : (
                                        <div className="athlete-photo-placeholder">
                                            {athlete.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="athlete-info">
                                    <h3>{athlete.name}</h3>
                                    {athlete.club && <p className="athlete-club"> {athlete.club}</p>}
                                    {athlete.birthYear && <p className="athlete-year">Născut în {athlete.birthYear}</p>}
                                </div>
                                <span className="athlete-arrow">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <div className="pagination">
                {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setPage(i)} disabled={i === page}>{i + 1}</button>
                ))}
            </div>
        </div>
    );
}

export default Athletes;