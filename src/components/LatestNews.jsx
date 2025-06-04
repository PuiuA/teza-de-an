import './LatestNews.css';
import NewsCard from './NewsCard';

function LatestNews() {
    return (
        <div className="latest-news">
            <h2>Ultimele Știri</h2>
            <hr />
            <NewsCard
                title="Titlu știre 1"
                date="3 iunie 2025"
                description="Worem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus..."
            />
            <NewsCard
                title="Titlu știre 2"
                date="28 mai 2025"
                description="Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus..."
            />
            <NewsCard
                title="Titlu știre 3"
                date="21 mai 2025"
                description="Vestibulum sit amet urna turpis. Mauris euismod elit et nisi ultrices, ut faucibus orci tincidunt..."
            />
            <div className="news-button-container">
                <button className="news-button">Accesează știri</button>
            </div>
        </div>
    );
}

export default LatestNews;
