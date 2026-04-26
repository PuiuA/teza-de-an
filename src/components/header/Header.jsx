import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/logo.png';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="header">
            <div className="logo-container">
                <img src={logo} alt="Federatia Judo Moldova" className="logo" />
            </div>
            <div className="header-spacer" />
            <button
                className={`hamburger ${menuOpen ? 'open' : ''}`}
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Meniu"
            >
                <span /><span /><span />
            </button>
            <nav className={`nav ${menuOpen ? 'open' : ''}`}>
                <Link to="/" onClick={closeMenu}>Acasă</Link>
                <Link to="/competitions" onClick={closeMenu}>Competiții</Link>
                <Link to="/news" onClick={closeMenu}>Știri</Link>
                <Link to="/results" onClick={closeMenu}>Rezultate</Link>
                <Link to="/athletes" onClick={closeMenu}>Sportivi</Link>
                <Link to="/contacts" onClick={closeMenu}>Contacte</Link>
                <Link to="/sponsors" onClick={closeMenu}>Sponsori</Link>
            </nav>
        </header>
    );
}

export default Header;
