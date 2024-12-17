import "./Leaderboard.css";
import axios from "../../api/axios.ts";
import { FETCH_LEADERBOARD } from "../../api/urls";
import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";

// define the type of leaderboard entries, depends on how backend passes it, for now defined as username and points
interface LeaderboardEntry {
  username: string;
  totalexp: number;
}

interface LeaderboardProps {
  users: LeaderboardEntry[]; // the list of users for the leaderboard
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]); // State to hold the leaderboard data
  const [isLoading, setIsLoading] = useState<boolean>(true); // State to track loading status

  //fetch the leaderboard
  useEffect(() => {
    async function fetchLeaderboard() {
      const resp = await axios.get(FETCH_LEADERBOARD);
      const data = resp.data.users;
      //console.log("This is the leaderboard", data);
      setLeaderboard(data);
      //console.log("This is the leaderboard variable", setLeaderboard);
      setIsLoading(!isLoading);
    }
    fetchLeaderboard();
  }, []);

  const leftColumn = leaderboard.slice(0, 5);
  const rightColumn = leaderboard.slice(5, 10);

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">LEADERBOARD</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="leaderboard-columns">
          <ul className="leaderboard-list left">
            {leftColumn.map((user, index) => (
              <li key={index} className="leaderboard-entry">
                <span className="rank">{index + 1}</span>
                <span className="username">{user.username}</span>
                <span className="points">{user.totalexp} XP</span>
              </li>
            ))}
          </ul>
          <ul className="leaderboard-list right">
            {rightColumn.map((user, index) => (
              <li key={index + 5} className="leaderboard-entry">
                <span className="rank">{index + 6}</span>
                <span className="username">{user.username}</span>
                <span className="points">{user.totalexp} XP</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="animals">
        <Col>
          <img
            src="/src/assets/animals.svg"
            alt="Animals"
            className="cropped-image"
          />
        </Col>
      </div>
      <div className="catch-more">Catch more animals!</div>
    </div>
  );
}
