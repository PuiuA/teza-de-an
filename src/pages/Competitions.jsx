import './css/Competitions.css';
import {useEffect, useState} from 'react';
import CompetitionList from '../components/CompetitionList';

function Competitions() {
    const [comp,setComp] = useState([]);
    const currentYear = new Date().getFullYear();
    const [searchTitle, setSearchTitle] = useState('');
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const filteredCompetitions = (comp || []).filter(comp => {
        const year = new Date(comp.date).getFullYear();
        return (
            year === Number(selectedYear) &&
            comp.title.toLowerCase().includes(searchTitle.toLowerCase())
        );
    });

    useEffect(() => {
        fetch(`http://localhost:8080/api/competition`)
            .then(res => res.json())
            .then(data => {
                console.table(data);
                setComp(data); // NU data.items — backendul returnează deja o listă
            });
    }, []);



    return (
        <div className="competitions-page">
            <h2>Competiții</h2>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Denumirea Competiției"
                    value={searchTitle}
                    onChange={e => setSearchTitle(e.target.value)}
                />

                <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                >
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                </select>

                <button>Caută</button>
            </div>

            <CompetitionList competitions={filteredCompetitions} />
        </div>
    );
}

export default Competitions;
