import './css/Home.css';
import homeImage from '../assets/images/image-home.jpeg';
import RecentCompetitions from "../components/RecentCompetitions.jsx";
import LatestNews from "../components/LatestNews.jsx";
import Sponsors from "../components/Sponsors.jsx";

function Home() {
    return (
        <div className="home-container">
            <img src={homeImage} alt="Imagine Judo" className="home-image" />
            <RecentCompetitions />
            <LatestNews />
            <Sponsors />
        </div>
    );
}

export default Home;
