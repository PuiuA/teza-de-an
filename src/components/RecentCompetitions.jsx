import './RecentCompetitions.css';
import EventCard from './EventCard';
import {Link} from "react-router-dom";

function RecentCompetitions() {
    return (
        <div className="recent-competitions">
            <h2>Competiții</h2>
            <EventCard
                title="Campionatul Național de Judo"
                date="10 iunie 2025"
                location="Chișinău"
            />
            <EventCard
                title="Turneul Internațional Juniori"
                date="24 iunie 2025"
                location="Bălți"
            />
            <div className="center-button">
                <Link to="/competitions"><button>Accesează Competiții</button></Link>
            </div>
        </div>
    );
}

export default RecentCompetitions;
