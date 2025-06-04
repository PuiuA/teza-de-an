import './EventCard.css';

function EventCard({ title, date, location }) {
    return (
        <div className="event-card">
            <h3>{title}</h3>
            <p><strong>{date}</strong></p>
            <p>{location}</p>
            <hr />
        </div>
    );
}

export default EventCard;
