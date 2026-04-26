import React from 'react';
import ResultCard from './ResultCard.jsx';
// import './ResultList.css';

function ResultList({ results }) {
    return (
        <div className="result-list">
            {results.length > 0 ? (
                results.map(result => (
                    <ResultCard key={result.id} result={result} />
                ))
            ) : (
                <div className="no-div">Nu sunt rezultate disponibile</div>
            )}
        </div>
    );
}


export default ResultList;
