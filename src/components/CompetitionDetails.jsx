import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './CompetitionDetails.css';

function CompetitionDetails() {
    const { id } = useParams();
    const [competition, setCompetition] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/competition/${id}`)
            .then(res => res.json())
            .then(data => setCompetition(data))
            .catch(err => console.error('Eroare:', err));
    }, [id]);

    if (!competition) {
        return <p>Se încarcă competiția...</p>;
    }

    const formattedDate = new Date(competition.date).toLocaleDateString();
    const formattedTime = new Date(competition.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="competition-details-container">
            <h2 className="competition-title">{competition.title}</h2>
            <p className="competition-date">Data: {formattedDate} {formattedTime}</p>

            <div className="competition-image-wrapper">
                {competition.image ? (
                    <img
                        src={`data:image/jpeg;base64,${competition.image}`}
                        alt={competition.title}
                        className="competition-image"
                    />
                ) : (
                    <div className="competition-placeholder">IMG</div>
                )}
            </div>

            <hr className="competition-divider" />

            <p className="competition-description">
                {competition.description || 'Descrierea nu este disponibilă.'}
            </p>

        </div>
    );
}

export default CompetitionDetails;
