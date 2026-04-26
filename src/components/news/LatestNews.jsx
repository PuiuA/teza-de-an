import './LatestNews.css';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

function LatestNews() {
    const [newsList, setNewsList] = useState([]);

    useEffect(() => {
        fetch('https://localhost:8443/api/news/recent')
            .then(res => res.json())
            .then(data => setNewsList(data))
            .catch(err => console.error('Eroare știri:', err));
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('ro-RO', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    return (
        <section className="latest-news">
            <div className="latest-news-inner">
                <div className="section-header">
                    <h2 className="section-title">Ultimele Știri</h2>
                    <div className="section-line" />
                </div>

                <div className="news-grid">
                    {newsList.length === 0 ? (
                        <p className="news-empty">Nu sunt știri disponibile momentan.</p>
                    ) : (
                        newsList.map((n) => (
                            <Link
                                key={n.id}
                                to={`/news/${n.id}`}
                                className="news-card"
                            >
                                {n.image && (
                                    <img
                                        src={`data:image/jpeg;base64,${n.image}`}
                                        alt={n.title}
                                        className="news-card-image"
                                    />
                                )}
                                <div className="news-card-body">
                                    <p className="news-card-tag">
                                        {n.eventType?.eventType || 'Știre'} · {formatDate(n.published)}
                                    </p>
                                    <h3 className="news-card-title">{n.title}</h3>
                                    <p className="news-card-excerpt">{n.shortDescription}</p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                <div className="news-footer">
                    <Link to="/news" className="section-cta">
                        Toate Știrile <span className="section-cta-arrow">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default LatestNews;
