import Leaderboard from "../components/leaderboard/Leaderboard.tsx";
import "./Homepage.css"

const Homepage = () => {

    // pretend this data is coming from the backend
    const mockUsers = [
        { name: "Alice", points: 120 },
        { name: "Bob", points: 430 },
        { name: "Charlie", points: 2 },
        { name: "Diana", points: 72 },
        { name: "Eve", points: 80 },
    ];

    return (
        <div className="container">
            <div className="row">
                {/* for future components like map and postfeed */}
                <div className="col-md-3">
                    <Leaderboard users={mockUsers} />
                </div>
            </div>
        </div>
    );
};

export default Homepage;
