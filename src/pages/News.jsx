import { useEffect, useState } from 'react';
import NewsCard from '../components/news/NewsCard.jsx';
import './css/News.css';
import API from '../config/api.js';

function News() {
    const [news, setNews] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchNews = (currentPage = page, currentSearch = searchTitle, currentType = selectedType) => {
        const params = new URLSearchParams({ page: currentPage, size: 6 });
        if (currentSearch) params.append('title', currentSearch);
        if (currentType !== 'All') params.append('type', currentType);

        fetch(`${API}/api/news/paginated?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                setNews(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(err => console.error('Eroare:', err));
    };

    useEffect(() => {
        fetchNews(page);
    }, [page]);

    const handleSearch = () => {
        setPage(0);
        fetchNews(0, searchTitle, selectedType);
    };

    const handleClear = () => {
        setSearchTitle('');
        setPage(0);
        fetchNews(0, '', selectedType);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="news-page">
            <h2 className="page-title">Știri</h2>

            <div className="filters">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder="Titlul știrii"
                        value={searchTitle}
                        onChange={e => setSearchTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {searchTitle && (
                        <button className="clear-btn" onClick={handleClear} title="Șterge">✕</button>
                    )}
                </div>
                <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                    <option value="All">Toate</option>
                    <option value="COMPETIȚIE">Competiții</option>
                    <option value="CANTONAMENT">Cantonament</option>
                    <option value="SEMINAR">Seminar</option>
                    <option value="REZULTAT">Rezultate</option>
                </select>
                <button onClick={handleSearch}>Caută</button>
            </div>

            {news.length > 0 ? (
                news.map((n, index) => <NewsCard key={index} news={n} />)
            ) : (
                <div className="no-div">Nu sunt știri disponibile</div>
            )}

            <div className="pagination">
                {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setPage(i)} disabled={i === page}>{i + 1}</button>
                ))}
            </div>
        </div>
    );
}

export default News;