import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './css/Athletes.css';
import API from "../config/api.js";

function AthleteDetails() {
    const { id } = useParams();
    const [athlete, setAthlete] = useState(null);

    useEffect(() => {
        fetch(`${API}/api/athletes/${id}`)
            .then(res => res.json())
            .then(data => setAthlete(data))
            .catch(err => console.error('Error:', err));
    }, [id]);

    if (!athlete) return <p className="details-loading">Se încarcă...</p>;

    const getMedal = (place) => {
        if (place === 1) return '🥇';
        if (place === 2) return '🥈';
        if (place === 3 || place === 4) return '🥉';
        return '#' + place;
    };

    const getPlaceClass = (place) => {
        if (place === 1) return 'place-gold';
        if (place === 2) return 'place-silver';
        if (place === 3 || place === 4) return 'place-bronze';
        return 'place-other';
    };

    return (
        <div className="athlete-details-page">
            <Link to="/athletes" className="details-back">← Înapoi la Sportivi</Link>

            <div className="athlete-profile">
                <div className="athlete-profile-photo">
                    {athlete.photo ? (
                        <img src={"data:image/jpeg;base64," + athlete.photo} alt={athlete.name} />
                    ) : (
                        <div className="athlete-profile-photo-placeholder">
                            {athlete.name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="athlete-profile-info">
                    <h2>{athlete.name}</h2>
                    <div className="athlete-profile-meta">
                        {athlete.club && <span className="athlete-meta-badge"> {athlete.club}</span>}
                        {athlete.birthYear && <span className="athlete-meta-badge"> {athlete.birthYear}</span>}
                        {athlete.weightKg && <span className="athlete-meta-badge">{athlete.weightKg} kg</span>}
                        {athlete.belt && <span className="athlete-meta-badge">{athlete.belt}</span>}
                    </div>
                </div>
            </div>

            {athlete.competitionResults && athlete.competitionResults.length > 0 ? (
                <div className="athlete-competitions">
                    <div className="section-header">
                        <h3 className="section-title">Rezultate Competiționale</h3>
                        <div className="section-line" />
                    </div>
                    <div className="athlete-comp-list">
                        {athlete.competitionResults.map((cr, idx) => (
                            <Link key={idx} to={"/rezultate/" + cr.resultId} className="athlete-comp-item-link">
                                <div className="athlete-comp-item">
                                    <span className={"athlete-comp-place " + getPlaceClass(cr.place)}>
                                        {getMedal(cr.place)}
                                    </span>
                                    <div className="athlete-comp-info">
                                        <p className="athlete-comp-title">{cr.competitionTitle}</p>
                                        <p className="athlete-comp-meta">
                                            {cr.categoryGender} · {cr.categoryKg}{cr.competitionYear ? " · " + cr.competitionYear : ""}
                                        </p>
                                    </div>
                                    <span className="athlete-comp-arrow">→</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="no-div">Niciun rezultat competițional înregistrat.</div>
            )}
        </div>
    );
}

export default AthleteDetails;
