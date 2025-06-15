import { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import './css/News.css';

function News() {
    const [news, setNews] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchNews = () => {
        fetch(`http://localhost:8080/api/news/paginated?page=${page}&size=6`)
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

    return (
        <div className="news-page">
            <h2>Știri</h2>

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
