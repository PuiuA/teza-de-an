import './Sponsors.css';
import SponsorCard from './SponsorCard';

function Sponsors() {
    // Temporar, folosim mock-uri
    const sponsors = [
        '/sponsors/img1.png',
        '/sponsors/img2.png',
        '/sponsors/img3.png',
        '/sponsors/img4.png',
        '/sponsors/img5.png',
        '/sponsors/img6.png',
        '/sponsors/img7.png',
        '/sponsors/img8.png',
        '/sponsors/img9.png',
        '/sponsors/img10.png',
        '/sponsors/img11.png',
        '/sponsors/img12.png',
        '/sponsors/img13.png'
    ];

    return (
        <div className="sponsors-section">
            <h2>Partenerii FMJ</h2>
            <div className="sponsor-grid">
                {sponsors.map((src, index) => (
                    <SponsorCard key={index} src={src} alt={`Sponsor ${index + 1}`} />
                ))}
            </div>
        </div>
    );
}

export default Sponsors;
