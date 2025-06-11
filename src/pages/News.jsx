import { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import Pagination from '../components/Pagination';
import './css/News.css';

const pageSize = 6;

function News() {
    const [news, setNews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        // exemplu de request — înlocuiește cu backend real
        fetch(`https:/8080/api/news?page=${currentPage}&size=${pageSize}`)
            .then(res => res.json())
            .then(data => {
                setNews(data.items); // `items` = array cu știri
                setTotalPages(data.totalPages);
            });
    }, [currentPage]);

    return (
        <div className="news-page" style={{ padding: '30px' }}>
            <h2>Știri</h2>
            {news.map((n) => (
                <NewsCard key={n.id} news={n} />
            ))}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}

export default News;
