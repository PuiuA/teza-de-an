import React from 'react';
import ResultCard from './ResultCard';
// import './ResultList.css';

function ResultList({ results }) {
    return (
        <div className="result-list">
            {results.map(result => (
                <ResultCard key={result.id} result={result} />
            ))}
        </div>
    );
}

export default ResultList;
