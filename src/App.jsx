import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Competitions from './pages/Competitions';
import News from './pages/News';
import Results from './pages/Results';
import Contacts from './pages/Contacts';
import Sponsors from './pages/Sponsors';
import CompetitionDetails from "./components/CompetitionDetails.jsx";

function App() {
    return (
        <Router>
            <Header />
            <main>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/competitions" element={<Competitions />} />
                <Route path="/competitii/:id" element={<CompetitionDetails />} />
                <Route path="/news" element={<News />} />
                <Route path="/results" element={<Results />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/sponsors" element={<Sponsors />} />
            </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
