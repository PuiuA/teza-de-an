import './SponsorsList.css';
import SponsorCard from './SponsorCard';

// Importă dinamic toate imaginile PNG din folder
const images = import.meta.glob('../img.sponsori/*.png', { eager: true });

const sponsorImages = Object.values(images).map(module => module.default);

function SponsorsList() {
    return (
        <div className="sponsors-section">
            <h2>Partenerii FMJ</h2>
            <div className="sponsor-grid">
                {sponsorImages.map((src, index) => (
                    <SponsorCard key={index} src={src} alt={`Sponsor ${index + 1}`} />
                ))}
            </div>
        </div>
    );
}

export default SponsorsList;
