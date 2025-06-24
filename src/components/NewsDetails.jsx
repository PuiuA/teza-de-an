import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './NewsDetails.css';

function NewsDetails() {
    const { id } = useParams();
    const [news, setNews] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/news/${id}`)
            .then(res => res.json())
            .then(data => setNews(data))
            .catch(err => console.error('Eroare:', err));
    }, [id]);

    if (!news) {
        return <p>Se încarcă știrea...</p>;
    }

    const formattedDate = new Date(news.published).toLocaleDateString('ro-RO', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="news-details-container">
            <h2 className="news-title">{news.title}</h2>
            <p className="news-date">Publicată la: {formattedDate}</p>

            <div className="news-image-wrapper">
                {news.image ? (
                    <img
                        src={`data:image/jpeg;base64,${news.image}`}
                        alt={news.title}
                        className="news-image"
                    />
                ) : (
                    <div className="news-placeholder">IMG</div>
                )}
            </div>

            <hr className="news-divider" />

            <p className="news-description">{news.description}</p>

            {news.information && (
                <>
                    <h4>Informații suplimentare</h4>
                    <p>{news.information}</p>
                </>
            )}
            {news.author && (
                <p className="news-author">Autor: {news.author}</p>
            )}

            {news.links && news.links.length > 0 && (
                <>
                    <h4>Linkuri utile:</h4>
                    <ul className="news-links">
                        {news.links.map(link => (
                            <li key={link.id}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.text}</a>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default NewsDetails;
