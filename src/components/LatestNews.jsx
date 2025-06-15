import './LatestNews.css';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import NewsCard from "./NewsCard.jsx";

function LatestNews() {
    const [newsList, setNewsList] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/news/recent')
            .then(res => res.json())
            .then(data => setNewsList(data))
            .catch(err => console.error('Eroare la încărcarea știrilor:', err));
    }, []);

    return (
        <div className="latest-news">
            <h2>Ultimele Știri</h2>
            <hr />
            {newsList.map((n, index) => <NewsCard key={index} news={n} />)}

            <div className="news-button-container">
                <Link to="/news">
                    <button className="news-button">Accesează știri</button>
                </Link>
            </div>
        </div>
    );
}

export default LatestNews;