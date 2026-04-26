
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

function AdminDashboard() {
    const [stats, setStats] = useState({ news: 0, competitions: 0, athletes: 0, results: 0 });

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
        }).catch(console.error);
    }, []);

    return (
        <AdminLayout title="Dashboard">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                <StatCard icon="📰" label="Știri" value={stats.news} color="#4a90d9" />
                <StatCard icon="🏆" label="Competiții" value={stats.competitions} color="#f0a500" />
                <StatCard icon="🥋" label="Sportivi" value={stats.athletes} color="#28a745" />
                <StatCard icon="🥇" label="Rezultate" value={stats.results} color="#e05470" />
            </div>
        </AdminLayout>
    );
}

export default AdminDashboard;
