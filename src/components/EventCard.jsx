import { Link } from "react-router-dom";
import './EventCard.css';

function EventCard({ id, title, date, location }) {
    return (
        <Link to={`/competitii/${id}`}>
            <div className="event-card">
                <h3>{title}</h3>
                <p><strong>{date}</strong></p>
                <p>{location}</p>
                <hr />
            </div>
        </Link>
    );
}

export default EventCard;
