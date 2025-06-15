import { useEffect, useState } from 'react';
import CompetitionList from '../components/CompetitionList';
import "./css/Competitions.css"

function Competitions() {
    const [competitions, setCompetitions] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCompetitions = () => {
        const params = new URLSearchParams({
            page,
            size: 6,
        });
        if (searchTitle) params.append('title', searchTitle);
        if (selectedYear !== 'All') params.append('year', selectedYear);

        fetch(`http://localhost:8080/api/competition/paginated?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                setCompetitions(data.content);
                setTotalPages(data.totalPages);
            });
    };

    useEffect(() => {
        fetchCompetitions();
    }, [page]);

    const handleSearch = () => {
        setPage(0);
        fetchCompetitions();
    };

    return (
        <div className="competitions-page">
            <h2>Competiții</h2>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Denumirea competiției"
                    value={searchTitle}
                    onChange={e => setSearchTitle(e.target.value)}
                />
                <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                >
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
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        disabled={i === page}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Competitions;
