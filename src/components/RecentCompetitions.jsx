import './RecentCompetitions.css';
import EventCard from './EventCard';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function RecentCompetitions() {
    const [competitions, setCompetitions] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/competition/recent')
            .then(res => res.json())
            .then(data => setCompetitions(data));
    }, []);

    return (
        <div className="recent-competitions">
            <h2>Competiții</h2>

            {competitions.map((comp, index) => (
                <EventCard
                    key={index}
                    id={comp.id}
                    title={comp.title}
                    date={comp.date}
                    location={comp.location}
                />
            ))}

            <div className="center-button">
                <Link to="/competitions">
                    <button>Accesează Competiții</button>
                </Link>
            </div>
        </div>
    );
}

export default RecentCompetitions;
