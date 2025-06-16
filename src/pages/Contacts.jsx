import './css/Contacts.css';

function Contacts() {
    return (
        <div className="contacts-container">
            <h2 className="contacts-title">Contacte</h2>

            <div className="contact-info-box">
                <p><strong>Telefon:</strong> +373 00 000 400</p>
                <p><strong>Email:</strong> contact@fjm.md</p>
                <p><strong>Adresă:</strong> Bulevardul Decebal 72, Chișinău </p>
            </div>

            <div className="map-container">
                <iframe
                    title="Harta FMJ"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2721.2741365290312!2d28.856182900000004!3d46.99558999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97eac1a4432a3%3A0x3165faeb774c6699!2sRezervele%20Olimpice!5e0!3m2!1sro!2s!4v1750063533944!5m2!1sro!2s"
                    width="100%"
                    height="400"
                    style={{border: 0}}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>
        </div>
    );
}


export default Contacts;
