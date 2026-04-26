import { useEffect, useState } from 'react';
import CompetitionList from '../components/competition/CompetitionList.jsx';
import "./css/Competitions.css";

function Competitions() {
    const [competitions, setCompetitions] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCompetitions = (currentPage = page, currentSearch = searchTitle, currentYear = selectedYear) => {
        const params = new URLSearchParams({ page: currentPage, size: 6 });
        if (currentSearch) params.append('title', currentSearch);
        if (currentYear !== 'All') params.append('year', currentYear);

        fetch(`https://localhost:8443/api/competition/paginated?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                setCompetitions(data.content);
                setTotalPages(data.totalPages);
            });
    };

    useEffect(() => {
        fetchCompetitions(page);
    }, [page]);

    const handleSearch = () => {
        setPage(0);
        fetchCompetitions(0, searchTitle, selectedYear);
    };

    const handleClear = () => {
        setSearchTitle('');
        setPage(0);
        fetchCompetitions(0, '', selectedYear);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="competitions-page">
            <h2 className="page-title">Competiții</h2>

            <div className="filters">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder="Denumirea competiției"
                        value={searchTitle}
                        onChange={e => setSearchTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {searchTitle && (
                        <button className="clear-btn" onClick={handleClear} title="Șterge">✕</button>
                    )}
                </div>
                <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                    <option value="All">Toate</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                </select>
                <button onClick={handleSearch}>Caută</button>
            </div>

            <CompetitionList competitions={competitions} />

            <div className="pagination">
                {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setPage(i)} disabled={i === page}>{i + 1}</button>
                ))}
            </div>
        </div>
    );
}

export default Competitions;