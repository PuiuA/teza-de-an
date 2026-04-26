import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

function Footer() {
    const [clickCount, setClickCount] = useState(0);
    const navigate = useNavigate();

    const handleSecretClick = useCallback(() => {
        setClickCount(prev => {
            const next = prev + 1;
            if (next >= 5) {
                navigate('/admin/login');
                return 0;
            }
            return next;
        });
    }, [navigate]);

    return (
        <footer className="footer">
            <p
                className="footer-text"
                onClick={handleSecretClick}
                style={{ cursor: 'default', userSelect: 'none' }}
            >
                FJM © 2025 - Toate drepturile rezervate.
            </p>
        </footer>
    );
}

export default Footer;
