import CompetitionCard from './CompetitionCard';

function CompetitionList({ competitions }) {
    return (
        <div>
            {competitions.map((comp, index) => (
                <CompetitionCard key={index} competition={comp} />
            ))}
        </div>
    );
}

export default CompetitionList;
