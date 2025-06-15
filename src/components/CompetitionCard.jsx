import { Link } from 'react-router-dom';
import './CompetitionCard.css';

function CompetitionCard({ competition }) {
    return (
        <Link to={`/competitii/${competition.id}`} className="competition-link">
            <div className="competition-card">
                <div className="competition-info">
                    <p>
                        <strong>{new Date(competition.date).toLocaleDateString()}</strong> –
                        {new Date(competition.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <h3>{competition.title}</h3>
                    <p>{competition.location}</p>
                </div>
                <div className="competition-img">
                    <img
                        src={`data:image/jpg;base64,${competition.image}`}
                        alt={competition.title}
                        className="competition-image"
                    />
                </div>
            </div>
        </Link>
    );
}

export default CompetitionCard;
