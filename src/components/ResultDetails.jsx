import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./ResultDetails.css"

function ResultDetails() {
    const { id } = useParams();
    const [result, setResult] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/results/${id}`)
            .then(res => res.json())
            .then(data => setResult(data))
            .catch(err => console.error('Error:', err));
    }, [id]);

    if (!result) return <p>Se încarcă...</p>;

    return (
        <div className="result-details">
            <h2>{result.title}</h2>

            {result.categoryResults && result.categoryResults.length > 0 ? (
                result.categoryResults.map((cat, idx) => (
                    <div key={idx} className="category-result">
                        <h4>{cat.category.gender} - {cat.category.kilograms}</h4>
                        <p>
                            {cat.competitors.split('\n').map((line, i) => (
                                <span key={i}>{line}<br /></span>
                            ))}
                        </p>
                    </div>
                ))
            ) : (
                <p>Rezultatele nu au fost găsite.</p>
            )}
        </div>
    );
}

export default ResultDetails;
