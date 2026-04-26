import { useEffect, useState } from 'react';
import './SponsorsList.css';
import SponsorCard from './SponsorCard.jsx';
import API from "../../config/api.js";

function SponsorsList() {
    const [sponsors, setSponsors] = useState([]);

    useEffect(() => {
        fetch(`${API}/api/sponsors`)
            .then(res => res.json())
            .then(data => setSponsors(data))
            .catch(err => console.error('Eroare sponsori:', err));
    }, []);

    if (sponsors.length === 0) return null;

    return (
        <section className="sponsors-section">
            <div className="section-header">
                <h2 className="section-title">Partenerii FJM</h2>
                <div className="section-line" />
            </div>
            <div className="sponsor-grid">
                {sponsors.map((sponsor) => (
                    <SponsorCard
                        key={sponsor.id}
                        src={sponsor.image ? `data:image/png;base64,${sponsor.image}` : null}
                        alt={sponsor.title}
                        link={sponsor.link}
                    />
                ))}
            </div>
        </section>
    );
}

export default SponsorsList;