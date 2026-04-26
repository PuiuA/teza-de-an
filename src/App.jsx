import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header.jsx';
import Footer from './components/footer/Footer.jsx';
import Home from './pages/Home';
import Competitions from './pages/Competitions';
import News from './pages/News';
import Results from './pages/Results';
import ResultsByYear from './pages/ResultsByYear';
import Athletes from './pages/Athletes';
import AthleteDetails from './pages/AthleteDetails';
import Contacts from './pages/Contacts';
import Sponsors from './pages/Sponsors';
import CompetitionDetails from './components/competition/CompetitionDetails.jsx';
import NewsDetails from './components/news/NewsDetails.jsx';
import ResultDetails from './components/result/ResultDetails.jsx';

// Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNews from './pages/admin/AdminNews';
import AdminCompetitions from './pages/admin/AdminCompetitions';
import AdminResults from './pages/admin/AdminResults';
import AdminAthletes from './pages/admin/AdminAthletes';
import AdminSponsors from './pages/admin/AdminSponsors';
import AdminUsers from './pages/admin/AdminUsers';
import PrivateRoute from './components/admin/PrivateRoute';

import './App.css';
import AdminResultEdit from "./pages/admin/AdminResultEdit.jsx";

function PublicLayout({ children }) {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                {/* ── Public routes ── */}
                <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                <Route path="/competitions" element={<PublicLayout><Competitions /></PublicLayout>} />
                <Route path="/competitions/:id" element={<PublicLayout><CompetitionDetails /></PublicLayout>} />
                <Route path="/news" element={<PublicLayout><News /></PublicLayout>} />
                <Route path="/news/:id" element={<PublicLayout><NewsDetails /></PublicLayout>} />
                <Route path="/results" element={<PublicLayout><Results /></PublicLayout>} />
                <Route path="/results/year/:year" element={<PublicLayout><ResultsByYear /></PublicLayout>} />
                <Route path="/rezultate/:id" element={<PublicLayout><ResultDetails /></PublicLayout>} />
                <Route path="/athletes" element={<PublicLayout><Athletes /></PublicLayout>} />
                <Route path="/athletes/:id" element={<PublicLayout><AthleteDetails /></PublicLayout>} />
                <Route path="/contacts" element={<PublicLayout><Contacts /></PublicLayout>} />
                <Route path="/sponsors" element={<PublicLayout><Sponsors /></PublicLayout>} />

                {/* ── Admin routes ── */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                <Route path="/admin/news" element={<PrivateRoute><AdminNews /></PrivateRoute>} />
                <Route path="/admin/competitions" element={<PrivateRoute><AdminCompetitions /></PrivateRoute>} />
                <Route path="/admin/results" element={<PrivateRoute><AdminResults /></PrivateRoute>} />
                <Route path="/admin/athletes" element={<PrivateRoute><AdminAthletes /></PrivateRoute>} />
                <Route path="/admin/sponsors" element={<PrivateRoute><AdminSponsors /></PrivateRoute>} />
                <Route path="/admin/users" element={<PrivateRoute requireSuperAdmin><AdminUsers /></PrivateRoute>} />
                <Route path="/admin/results/:id/edit" element={<PrivateRoute><AdminResultEdit /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;