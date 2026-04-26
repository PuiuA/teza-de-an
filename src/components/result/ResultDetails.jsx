import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ResultDetails.css';
import API from "../../config/api.js";

function ResultDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);

    useEffect(() => {
        fetch(`${API}/api/results/${id}`)
            .then(res => res.json())
            .then(data => setResult(data))
            .catch(err => console.error('Error:', err));
    }, [id]);

    if (!result) return <p className="details-loading">Se încarcă rezultatele...</p>;

    const getAgeLabel = (age) => {
        if (age === 18) return 'U18 · Cadeți';
        if (age === 21) return 'U21 · Juniori';
        if (age === 15) return 'U15 · Copii';
        return `U${age}`;
    };

    const getMedal = (place) => {
        if (place === 1) return '🥇';
        if (place === 2) return '🥈';
        if (place === 3 || place === 4) return '🥉';
        return `${place}.`;
    };

    const getRankClass = (place) => {
        if (place === 1) return 'gold';
        if (place === 2) return 'silver';
        if (place === 3 || place === 4) return 'bronze';
        return '';
    };

    return (
        <div className="result-details">
            <button className="details-back-result" onClick={() => navigate(-1)}>
                ← Înapoi la Competiții {result.year}
            </button>

            <h2 className="result-details-title">{result.title}</h2>
            <span className="result-age-badge">{getAgeLabel(result.age)}</span>

            {result.categoryResults && result.categoryResults.length > 0 ? (
                <div className="categories-grid">
                    {result.categoryResults.map((cat, idx) => (
                        <div key={idx} className="category-result">
                            <h4>{cat.category.gender} · {cat.category.kilograms}</h4>

                            {cat.athleteResults && cat.athleteResults.length > 0 ? (
                                <ul className="competitors-list">
                                    {cat.athleteResults.map((ar) => (
                                        <li key={ar.id} className="competitor-item">
                                            <span className={`competitor-rank ${getRankClass(ar.place)}`}>
                                                {getMedal(ar.place)}
                                            </span>
                                            <Link
                                                to={`/athletes/${ar.athleteId}`}
                                                className="competitor-name-link"
                                            >
                                                {ar.athleteName}
                                                {ar.athleteClub && (
                                                    <span className="competitor-club"> · {ar.athleteClub}</span>
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-athletes">Fără sportivi înregistrați</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-div">Rezultatele nu au fost găsite.</div>
            )}
        </div>
    );
}

export default ResultDetails;
