import './SponsorCard.css';

function SponsorCard({ src, alt }) {
    return (
        <div className="sponsor-card">
            <img src={src} alt={alt} />
        </div>
    );
}

export default SponsorCard;
