import "./Leaderboard.css";
import axios from "../../api/axios.ts";
import {
  FETCH_LEADERBOARD_EXP,
  FETCH_LEADERBOARD_FOLLOWERS,
} from "../../api/urls";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";

interface LeaderboardpageProps {
  activeTab: number;
}
// define the type of leaderboard entries, depends on how backend passes it, for now defined as username and points
interface LeaderboardEntry {
  username: string;
  totalexp: number;
  follower_count: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]); // State to hold the leaderboard data
  const [isLoading, setIsLoading] = useState<boolean>(true); // State to track loading status
  const [activeTab, setActiveTab] = useState(0);

  async function fetchLeaderboard() {
    const url = activeTab ? FETCH_LEADERBOARD_FOLLOWERS : FETCH_LEADERBOARD_EXP;
    const resp = await axios.get(url);
    const data = resp.data.users;
    console.log("This is the leaderboard", data);
    setLeaderboard(data);
    //console.log("This is the leaderboard variable", setLeaderboard);
    setIsLoading(false);
  }

  //fetch the leaderboard
  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab]);

  const leftColumn = leaderboard.slice(0, 5);
  const rightColumn = leaderboard.slice(5, 10);

  return (
    <div className="leaderboard-container">
      <Row className="title-row justify-content-center">
        <Col xs="auto">
          <Button
            variant="danger"
            onClick={() => setActiveTab(0)}
            className={`tab-button ${activeTab === 0 ? "active" : ""}`}
          >
            Global
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            variant="danger"
            onClick={() => {
              setActiveTab(1);
            }}
            className={`tab-button ${activeTab === 1 ? "active" : ""}`}
          >
            Most followed
          </Button>
        </Col>
      </Row>
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
                <span className="points">
                  {activeTab === 0
                    ? `${user.totalexp} XP`
                    : `${user.follower_count} Followers`}{" "}
                </span>
              </li>
            ))}
          </ul>
          <ul className="leaderboard-list right">
            {rightColumn.map((user, index) => (
              <li key={index + 5} className="leaderboard-entry">
                <span className="rank">{index + 6}</span>
                <span className="username">{user.username}</span>
                <span className="points">
                  {activeTab === 0
                    ? `${user.totalexp} XP`
                    : `${user.follower_count} Followers`}{" "}
                </span>
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
