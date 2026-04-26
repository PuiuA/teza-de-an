import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Results.css';
import API from "../config/api.js";

function Results() {
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API}/api/results/years`)
            .then(res => res.json())
            .then(data => setYears(data))
            .catch(err => console.error('Error:', err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="results-page">
            <h2 className="page-title">Rezultate</h2>
            <p className="results-subtitle">Selectează anul pentru a vedea competițiile</p>

            {loading ? (
                <p className="results-loading">Se încarcă...</p>
            ) : years.length === 0 ? (
                <div className="no-div">Nu sunt rezultate disponibile</div>
            ) : (
                <div className="years-grid">
                    {years.map(year => (
                        <button
                            key={year}
                            className="year-card"
                            onClick={() => navigate(`/results/year/${year}`)}
                        >
                            <span className="year-number">{year}</span>
                            <span className="year-label">Vezi competițiile →</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Results;
