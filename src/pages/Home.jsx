import './css/Home.css';
import homeImage from '../assets/images/image-home.jpeg';
import { Link } from 'react-router-dom';
import RecentCompetitions from "../components/news/RecentCompetitions.jsx";
import LatestNews from "../components/news/LatestNews.jsx";
import SponsorsList from "../components/sponsors/SponsorsList.jsx";

function Home() {
    return (
        <div className="home-container">

            {/* ── Hero ── */}
            <div className="hero-wrapper">
                <img src={homeImage} alt="Judo Moldova" className="home-image" />
                <div className="hero-overlay">
                    <span className="hero-tag">Federația de Judo Moldova</span>
                    <h1 className="hero-title">
                        Forță, Disciplină<br />
                        și <span>Excelență</span>
                    </h1>
                    <p className="hero-slogan">
                        Urmărește competițiile, rezultatele și știrile oficiale ale judoului moldovenesc.
                    </p>
                    <Link to="/competitions" className="hero-cta">
                        Competiții <span className="hero-cta-arrow">→</span>
                    </Link>
                </div>
            </div>

            <RecentCompetitions />
            <LatestNews />
            <SponsorsList />
        </div>
    );
}

export default Home;
