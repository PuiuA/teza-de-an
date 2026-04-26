import React from 'react';
import { Link } from 'react-router-dom';
import './ResultCard.css';

function ResultCard({ result }) {
    const ageLabel = result.age === 18 ? "U18 (Cadeti)"
        : result.age === 21 ? "U21 (Juniori)"
            : `U${result.age}`;

    return (
        <Link to={`/rezultate/${result.id}`} className="result-card">
            <div className="result-box">
                <h3>{result.competitionTitle} - {ageLabel}</h3>
            </div>
        </Link>
    );
}

export default ResultCard;
