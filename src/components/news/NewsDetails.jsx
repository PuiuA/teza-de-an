import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './NewsDetails.css';

function NewsDetails() {
    const { id } = useParams();
    const [news, setNews] = useState(null);

    useEffect(() => {
        fetch(`https://localhost:8443/api/news/${id}`)
            .then(res => res.json())
            .then(data => setNews(data))
            .catch(err => console.error('Eroare:', err));
    }, [id]);

    if (!news) {
        return <p className="details-loading">Se încarcă știrea...</p>;
    }

    const formattedDate = new Date(news.published).toLocaleDateString('ro-RO', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="news-details-container">
            <Link to="/news" className="details-back">← Înapoi la Știri</Link>

            <h2 className="news-title">{news.title}</h2>

            <div className="news-meta">
                <span className="news-date">{formattedDate}</span>
                {news.author && (
                    <span className="news-author-tag">Autor: {news.author}</span>
                )}
            </div>

            <div className="news-image-wrapper">
                {news.image ? (
                    <img
                        src={`data:image/jpeg;base64,${news.image}`}
                        alt={news.title}
                        className="news-image"
                    />
                ) : (
                    <div className="news-placeholder">Fără imagine</div>
                )}
            </div>

            <hr className="news-divider" />

            <p className="news-description">{news.description}</p>

            {news.information && (
                <div className="news-info-block">
                    <h4>Informații suplimentare</h4>
                    <p>{news.information}</p>
                </div>
            )}

            {news.links && news.links.length > 0 && (
                <div className="news-links-block">
                    <h4>Linkuri utile</h4>
                    <ul className="news-links">
                        {news.links.map(link => (
                            <li key={link.id}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                    {link.description || link.url}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default NewsDetails;
