import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { authService } from '../../services/authService';

function StatCard({ icon, label, value, color }) {
    return (
        <div style={{
            background: '#fff', borderRadius: '12px', padding: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            borderLeft: `4px solid ${color}`,
            display: 'flex', alignItems: 'center', gap: '16px'
        }}>
            <span style={{ fontSize: '2rem' }}>{icon}</span>
            <div>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7a8d', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#1a2535', fontFamily: 'Georgia, serif' }}>{value}</p>
            </div>
        </div>
    );
}

function SectionTitle({ title }) {
    return (
        <div style={{ margin: '32px 0 16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'Georgia, serif', color: '#1a2535', fontWeight: 700 }}>{title}</h3>
            <div style={{ width: '40px', height: '3px', background: '#4a90d9', borderRadius: '2px', marginTop: '6px' }} />
        </div>
    );
}

function RecentItem({ icon, title, subtitle, date }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderBottom: '1px solid #f0f2f5'
        }}>
            <span style={{ fontSize: '1.3rem' }}>{icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#1a2535', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</p>
                {subtitle && <p style={{ margin: 0, fontSize: '12px', color: '#8a96a3' }}>{subtitle}</p>}
            </div>
            {date && <span style={{ fontSize: '11px', color: '#a0aebb', whiteSpace: 'nowrap' }}>{new Date(date).toLocaleDateString('ro-RO')}</span>}
        </div>
    );
}

function ClubBar({ club, count, max }) {
    const pct = Math.round((count / max) * 100);
    return (
        <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', color: '#1a2535', fontWeight: 600 }}>{club || 'Fără club'}</span>
                <span style={{ fontSize: '13px', color: '#6b7a8d', fontWeight: 700 }}>{count}</span>
            </div>
            <div style={{ background: '#e8edf4', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, background: '#4a90d9', height: '100%', borderRadius: '4px', transition: 'width 0.6s ease' }} />
            </div>
        </div>
    );
}

function AdminDashboard() {
    const [stats, setStats] = useState({ news: 0, competitions: 0, athletes: 0, results: 0 });
    const [recentNews, setRecentNews] = useState([]);
    const [recentCompetitions, setRecentCompetitions] = useState([]);
    const [clubStats, setClubStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            authService.fetchWithAuth('/api/news').then(r => r?.json()),
            authService.fetchWithAuth('/api/competition').then(r => r?.json()),
            authService.fetchWithAuth('/api/athletes').then(r => r?.json()),
            authService.fetchWithAuth('/api/results').then(r => r?.json()),
        ]).then(([news, competitions, athletes, results]) => {
            setStats({
                news: news?.length ?? 0,
                competitions: competitions?.length ?? 0,
                athletes: athletes?.length ?? 0,
                results: results?.length ?? 0,
            });

            // Ultimele 5 știri
            if (news) {
                const sorted = [...news].sort((a, b) =>
                    new Date(b.published) - new Date(a.published));
                setRecentNews(sorted.slice(0, 5));
            }

            // Ultimele 5 competiții
            if (competitions) {
                const sorted = [...competitions].sort((a, b) =>
                    new Date(b.date) - new Date(a.date));
                setRecentCompetitions(sorted.slice(0, 5));
            }

            // Sportivi pe club
            if (athletes) {
                const clubMap = {};
                athletes.forEach(a => {
                    const club = a.club || 'Fără club';
                    clubMap[club] = (clubMap[club] || 0) + 1;
                });
                const sorted = Object.entries(clubMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8);
                setClubStats(sorted);
            }
        }).catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const maxClub = clubStats.length > 0 ? clubStats[0][1] : 1;

    return (
        <AdminLayout title="Dashboard">
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                <StatCard icon="📰" label="Știri" value={stats.news} color="#4a90d9" />
                <StatCard icon="🏆" label="Competiții" value={stats.competitions} color="#f0a500" />
                <StatCard icon="🥋" label="Sportivi" value={stats.athletes} color="#28a745" />
                <StatCard icon="🥇" label="Rezultate" value={stats.results} color="#e05470" />
            </div>

            {/* Recent + Club stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginTop: '8px' }}>

                {/* Ultimele știri */}
                <div>
                    <SectionTitle title="Ultimele Știri" />
                    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                        {loading ? <p style={{ padding: '20px', color: '#a0aebb', textAlign: 'center' }}>Se încarcă...</p> :
                            recentNews.length === 0 ? <p style={{ padding: '20px', color: '#a0aebb', textAlign: 'center' }}>Nu există știri</p> :
                                recentNews.map(n => (
                                    <RecentItem
                                        key={n.id}
                                        icon="📰"
                                        title={n.title}
                                        subtitle={n.author || n.eventType?.eventType}
                                        date={n.published}
                                    />
                                ))
                        }
                    </div>
                </div>

                {/* Ultimele competiții */}
                <div>
                    <SectionTitle title="Ultimele Competiții" />
                    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                        {loading ? <p style={{ padding: '20px', color: '#a0aebb', textAlign: 'center' }}>Se încarcă...</p> :
                            recentCompetitions.length === 0 ? <p style={{ padding: '20px', color: '#a0aebb', textAlign: 'center' }}>Nu există competiții</p> :
                                recentCompetitions.map(c => (
                                    <RecentItem
                                        key={c.id}
                                        icon="🏆"
                                        title={c.title}
                                        subtitle={c.shortDescription?.substring(0, 40) + '...'}
                                        date={c.date}
                                    />
                                ))
                        }
                    </div>
                </div>

                {/* Sportivi pe club */}
                <div>
                    <SectionTitle title="Sportivi pe Club" />
                    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '20px' }}>
                        {loading ? <p style={{ color: '#a0aebb', textAlign: 'center' }}>Se încarcă...</p> :
                            clubStats.length === 0 ? <p style={{ color: '#a0aebb', textAlign: 'center' }}>Nu există date</p> :
                                clubStats.map(([club, count]) => (
                                    <ClubBar key={club} club={club} count={count} max={maxClub} />
                                ))
                        }
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminDashboard;