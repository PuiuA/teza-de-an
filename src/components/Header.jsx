import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';

function Header() {
    return (
        <header className="header">
            <div className="logo-container">
                <img src={logo} alt="Federatia Judo Moldova" className="logo" />
            </div>
            <nav className="nav">
                <Link to="/">ACASĂ</Link>
                <Link to="/competitions">COMPETIȚII</Link>
                <Link to="/news">ȘTIRI</Link>
                <Link to="/results">REZULTATE</Link>
                <Link to="/contacts">CONTACTE</Link>
                <Link to="/sponsors">SPONSORI</Link>
            </nav>
        </header>
    );
}

export default Header;
