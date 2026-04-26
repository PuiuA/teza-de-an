import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './CompetitionDetails.css';
import API from "../../config/api.js";

function CompetitionDetails() {
    const { id } = useParams();
    const [competition, setCompetition] = useState(null);

    useEffect(() => {
        fetch(`${API}/api/competition/${id}`)
            .then(res => res.json())
            .then(data => setCompetition(data))
            .catch(err => console.error('Eroare:', err));
    }, [id]);

    if (!competition) {
        return <p className="details-loading">Se încarcă competiția...</p>;
    }

    const formattedDate = new Date(competition.date).toLocaleDateString('ro-RO', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
    const formattedTime = new Date(competition.date).toLocaleTimeString('ro-RO', {
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="competition-details-container">
            <Link to="/competitions" className="details-back">← Înapoi la Competiții</Link>

            <h2 className="competition-title">{competition.title}</h2>
            <span className="competition-date"> {formattedDate} · {formattedTime}</span>

            <div className="competition-image-wrapper">
                {competition.image ? (
                    <img
                        src={`data:image/jpeg;base64,${competition.image}`}
                        alt={competition.title}
                        className="competition-image"
                    />
                ) : (
                    <div className="competition-placeholder">Fără imagine</div>
                )}
            </div>

            <hr className="competition-divider" />

            <p className="competition-description">
                {competition.description || 'Descrierea nu este disponibilă.'}
            </p>

            {competition.links && competition.links.length > 0 && (
                <div className="competition-links">
                    <h3>Linkuri utile</h3>
                    <ul>
                        {competition.links.map((link, index) => (
                            <li key={index}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                    {link.description || link.url}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default CompetitionDetails;
