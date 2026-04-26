import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './css/Results.css';

function ResultsByYear() {
    const { year } = useParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://localhost:8443/api/results/year/${year}`)
            .then(res => res.json())
            .then(data => setResults(data))
            .catch(err => console.error('Error:', err))
            .finally(() => setLoading(false));
    }, [year]);

    const getAgeLabel = (age) => {
        if (age === 18) return 'U18 · Cadeți';
        if (age === 21) return 'U21 · Juniori';
        if (age === 15) return 'U15 · Copii';
        return `U${age}`;
    };

    return (
        <div className="results-year-page">
            <Link to="/results" className="details-back">← Înapoi la Ani</Link>

            <div className="section-header">
                <h2 className="section-title">Competiții {year}</h2>
                <div className="section-line" />
            </div>

            {loading ? (
                <p className="results-loading">Se încarcă...</p>
            ) : results.length === 0 ? (
                <div className="no-div">Nu sunt rezultate pentru {year}</div>
            ) : (
                <div className="results-year-grid">
                    {results.map(result => (
                        <Link
                            key={result.id}
                            to={`/rezultate/${result.id}`}
                            className="result-item-link"
                        >
                            <div className="result-item">
                                <div className="result-item-info">
                                    <h3>{result.title}</h3>
                                    <span className="result-item-badge">
                                        {getAgeLabel(result.age)}
                                    </span>
                                </div>
                                <span className="result-item-arrow">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ResultsByYear;
