import "./Leaderboard.css";

// define the type of leaderboard entries, depends on how backend passes it, for now defined as username and points
interface LeaderboardEntry{
    name: string;
    points: number;
}

interface LeaderboardProps{
    users: LeaderboardEntry[]; // the list of users for the leaderboard
}

const getMedal = (index: number) => {
    switch (index) {
        case 0:
            return <img src={"src/assets/goldmedal.png"} alt="Gold Medal" className="medal" />;
        case 1:
            return <img src={"src/assets/silvermedal.png"} alt="Silver Medal" className="medal" />;
        case 2:
            return <img src={"src/assets/bronzemedal.png"} alt="Bronze Medal" className="medal" />;
        default:
            return <span className="rank">{index+1}</span>;
    }
};


const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => {
    // sort the users by points in descending order
    const sortedUsers = [...users].sort((a, b) => b.points - a.points);

    return (
        <div>
            <h2>Leaderboard</h2>
            <ol>
                {sortedUsers.map((user, index) => (
                    <li key={index}>
                        {getMedal(index)}
                        {user.name} - {user.points} points
                    </li>
                ))}
            </ol>
        </div>
    );
};



export default Leaderboard;