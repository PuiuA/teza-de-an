import { Link } from 'react-router-dom';
import './NewsCard.css';

function NewsCard({ news }) {
    const formattedDate = new Date(news.published).toLocaleDateString('ro-RO', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    return (
        <Link to={`/news/${news.id}`} className="news-link">
            <div className="news-card">
                <div className="news-img">
                    {news.image ? (
                        <img src={`data:image/jpeg;base64,${news.image}`} alt={news.title} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: '#e8edf4' }} />
                    )}
                </div>

                <div className="news-info">
                    <p className="news-card-tag">
                        {news.eventType?.eventType || 'Știre'}
                    </p>
                    <h3>{news.title}</h3>
                    <p className="short-description">
                        {news.shortDescription?.length > 150
                            ? news.shortDescription.slice(0, 150) + '...'
                            : news.shortDescription}
                    </p>
                    <p className="news-card-date"> {formattedDate}</p>
                </div>

                <span className="news-card-arrow">→</span>
            </div>
        </Link>
    );
}

export default NewsCard;
