import { Link } from 'react-router-dom';
import './CompetitionCard.css';

function CompetitionCard({ competition }) {
    const formattedDate = new Date(competition.date).toLocaleDateString('ro-RO', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
    const formattedTime = new Date(competition.date).toLocaleTimeString('ro-RO', {
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <Link to={`/competitions/${competition.id}`} className="competition-link">
            <div className="competition-card">
                <div className="competition-info">
                    <p className="competition-info-date">{formattedDate} · {formattedTime}</p>
                    <h3>{competition.title}</h3>
                    {competition.location && (
                        <p className="competition-info-location">
                            <span></span> {competition.location}
                        </p>
                    )}
                </div>

                <div className="competition-img">
                    {competition.image ? (
                        <img
                            src={`data:image/jpeg;base64,${competition.image}`}
                            alt={competition.title}
                            className="competition-image"
                        />
                    ) : (
                        <div className="competition-img-placeholder">Fără imagine</div>
                    )}
                </div>

                <span className="competition-arrow">→</span>
            </div>
        </Link>
    );
}

export default CompetitionCard;
