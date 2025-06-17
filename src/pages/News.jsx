import { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import './css/News.css';

function News() {
    const [news, setNews] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchNews = () => {
        const params = new URLSearchParams({
            page,
            size: 6
        });
        if (searchTitle) params.append('title', searchTitle);
        if (selectedType !== 'All') params.append('type', selectedType);

        fetch(`http://localhost:8080/api/news/paginated?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                setNews(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(err => console.error('Eroare la preluarea știrilor:', err));
    };

    useEffect(() => {
        fetchNews();
    }, [page]);

    const handleSearch = () => {
        setPage(0);
        fetchNews();
    };

    return (
        <div className="news-page">
            <h2>Știri</h2>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Titlul știrii"
                    value={searchTitle}
                    onChange={e => setSearchTitle(e.target.value)}
                />
                <select
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value)}
                >
                    <option value="All">Toate</option>
                    <option value="COMPETIȚIE">Competiție</option>
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

export default News;
