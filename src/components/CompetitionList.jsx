import CompetitionCard from './CompetitionCard';

function CompetitionList({ competitions }) {
    return (
        <div>
            {competitions.length > 0 ? (
                competitions.map((comp, index) => (
                    <CompetitionCard key={index} competition={comp} />
                ))
            ) : (
                <div className="no-div">No competitions</div>
            )}
        </div>
    );
}

export default CompetitionList;
