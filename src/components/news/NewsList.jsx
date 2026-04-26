import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewsCard from './NewsCard.jsx';

function NewsList() {
    const [news, setNews] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchNews = async () => {
        const res = await axios.get(`/api/news/paginated?page=${page}&size=6`);
        setNews(res.data.content);
        setTotalPages(res.data.totalPages);
    };

    useEffect(() => {
        fetchNews();
    }, [page]);

    return (
        <div className="news-page">
            <h2>Știri</h2>
            {news.map((n) => (
                <NewsCard key={n.id} news={n} />
            ))}

            <div className="pagination">
                <button onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0}>‹</button>
                <span>Pagina {page + 1} din {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))} disabled={page + 1 >= totalPages}>›</button>
            </div>
        </div>
    );
}

export default NewsList;
