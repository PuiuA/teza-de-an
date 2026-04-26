import './RecentCompetitions.css';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../config/api.js";

function RecentCompetitions() {
    const [competitions, setCompetitions] = useState([]);

    useEffect(() => {
        fetch(`${API}/api/competition/recent`)
            .then(res => res.json())
            .then(data => setCompetitions(data))
            .catch(err => console.error('Eroare competiții:', err));
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('ro-RO', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    };

    return (
        <section className="recent-competitions">
            <div className="section-header">
                <h2 className="section-title">Competiții Recente</h2>
                <div className="section-line" />
            </div>

            <div className="competitions-grid">
                {competitions.length === 0 ? (
                    <p className="comp-empty">Nu sunt competiții disponibile momentan.</p>
                ) : (
                    competitions.map((comp) => (
                        <Link
                            key={comp.id}
                            to={`/competitions/${comp.id}`}
                            className="competition-item"
                        >
                            <p className="competition-item-date">{formatDate(comp.date)}</p>
                            <h3 className="competition-item-title">{comp.title}</h3>
                            {comp.location && (
                                <p className="competition-item-location">
                                    <span>📍</span> {comp.location}
                                </p>
                            )}
                        </Link>
                    ))
                )}
            </div>

            <Link to="/competitions" className="section-cta">
                Toate Competițiile <span className="section-cta-arrow">→</span>
            </Link>
        </section>
    );
}

export default RecentCompetitions;
