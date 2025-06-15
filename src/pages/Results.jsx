import React, { useEffect, useState } from 'react';
import ResultList from '../components/ResultsList';
import './css/Results.css';

function Results() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/results') // adaptează URL-ul după backendul tău
            .then(res => res.json())
            .then(data => setResults(data))
            .catch(err => console.error('Error loading results:', err));
    }, []);

    return (
        <div className="results-page">
            <h2>Rezultate</h2>
            <ResultList results={results} />
        </div>
    );
}

export default Results;
