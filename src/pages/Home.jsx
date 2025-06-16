import './css/Home.css';
import homeImage from '../assets/images/image-home.jpeg';
import RecentCompetitions from "../components/RecentCompetitions.jsx";
import LatestNews from "../components/LatestNews.jsx";
import SponsorsList from "../components/SponsorsList.jsx";

function Home() {
    return (
        <div className="home-container">
            <img src={homeImage} alt="Imagine Judo" className="home-image" />
            <RecentCompetitions />
            <LatestNews />
            <SponsorsList />
        </div>
    );
}

export default Home;
