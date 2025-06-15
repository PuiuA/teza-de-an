import { Link } from 'react-router-dom';
import './NewsCard.css';

function NewsCard({ news }) {
    return (
        <Link to={`/news/${news.id}`} className="news-link">
            <div className="news-card">
                <div className="news-img">
                    <img src={`data:image/jpeg;base64,${news.image}`} alt={news.title} />
                </div>
                <div className="news-info">
                    <h3>{news.title}</h3>
                    <p className="short-description">
                        {news.shortDescription.length > 150
                            ? news.shortDescription.slice(0, 150) + '...'
                            : news.shortDescription}
                    </p>
                    <small>{new Date(news.published).toLocaleDateString()}</small>
                </div>
            </div>

        </Link>
    );
}

export default NewsCard;
