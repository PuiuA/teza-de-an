import './SponsorCard.css';

function SponsorCard({ src, alt, link }) {
    const card = (
        <div className="sponsor-card">
            {src && <img src={src} alt={alt} />}
        </div>
    );

    return link
        ? <a href={link} target="_blank" rel="noreferrer">{card}</a>
        : card;
}

export default SponsorCard;