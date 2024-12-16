import "./Leaderboard.css";
import axios from "../../api/axios.ts";
import { FETCH_LEADERBOARD } from "../../api/urls";
import { useEffect, useState } from "react";

// define the type of leaderboard entries, depends on how backend passes it, for now defined as username and points
interface LeaderboardEntry {
  username: string;
  totalexp: number;
}

interface LeaderboardProps {
  users: LeaderboardEntry[]; // the list of users for the leaderboard
}

export default function Leaderboard({ users }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]); // State to hold the leaderboard data
  const [isLoading, setIsLoading] = useState<boolean>(true); // State to track loading status

  //fetch the leaderboard
  useEffect(() => {
    async function fetchLeaderboard() {
      const resp = await axios.get(FETCH_LEADERBOARD);
      console.log("This is the leaderboard", resp.data);
    }
  });

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">LEADERBOARD</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ol className="leaderboard-list">
          {leaderboard.map((user, index) => (
            <li key={index} className="leaderboard-entry">
              <span className="rank">{index + 1}.</span>
              <span className="username">{user.username}</span>
              <span className="points">{user.totalexp} XP</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
