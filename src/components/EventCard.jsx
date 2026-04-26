import { Link } from "react-router-dom";
import './EventCard.css';

function EventCard({ id, title, date, location }) {
    return (
        <Link to={`/competitions/${id}`} className="event-card">
            <div className="event-card">
                <h3>{title}</h3>
                <p><strong>{new Date(date).toLocaleString('ro-RO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</strong></p>

                <p>{location}</p>
                <hr />
            </div>
        </Link>
    );
}

export default EventCard;
