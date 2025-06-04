import './NewsCard.css';

function NewsCard({ title, date, description }) {
    return (
        <div className="news-card">
            <div className="news-header">
                <h3>{title}</h3>
                <span className="news-date">{date}</span>
            </div>
            <p className="news-description">{description}</p>
        </div>
    );
}

export default NewsCard;
