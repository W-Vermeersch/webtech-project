import "./Leaderboard.css";
import axios from "../../api/axios.ts";
import {
  FETCH_LEADERBOARD_EXP,
  FETCH_LEADERBOARD_FOLLOWERS,
} from "../../api/urls";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";

// Define the type of leaderboard entries, totalexp for global leaderboard and the follower_count for the followers leaderboard.
interface LeaderboardEntry {
  username: string;
  totalexp: number;
  follower_count: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]); // State to hold the leaderboard data.
  // I work with 0 and 1 for activetab, because i do so in other files (for the modals).
  // whereas loading here is defined as a boolean (but also could be defined as 0 and 1).
  const [isLoading, setIsLoading] = useState<boolean>(true); // State to track loading status
  const [activeTab, setActiveTab] = useState(0); // State to keep track of the type of leaderboard.

  // This function will fetch the leaderboard from the backend based on the current active tab (determined by the buttons).
  // The controllers do not return any status, so no verification done here. However we could verify if the response is empty.
  async function fetchLeaderboard() {
    setIsLoading(true);
    const url = activeTab ? FETCH_LEADERBOARD_FOLLOWERS : FETCH_LEADERBOARD_EXP;
    const resp = await axios.get(url);
    const data = resp.data.users;
    console.log("This is the leaderboard", data);
    setLeaderboard(data);
    //console.log("This is the leaderboard variable", setLeaderboard);
    setIsLoading(false);
  }

  // Update the leaderboard information when activetab value changes.
  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab]);

  // Slice data to display on pc
  const leftColumn = leaderboard.slice(0, 5);
  const rightColumn = leaderboard.slice(5, 10);

  // display
  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">LEADERBOARD</h1>
      <Row className="title-row justify-content-center">
        <Col xs="auto">
        {/* Value of activeTab set to 0 if clicked on global button.*/}
          <Button
            variant="danger"
            onClick={() => setActiveTab(0)}
            className={`tab-button ${activeTab === 0 ? "active" : ""}`}
          >
            Global
          </Button>
        </Col>
        <Col xs="auto">
        {/* Value of activeTab set to 1 if clicked on most followed button.*/}
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
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="leaderboard-columns mt-2 mb-0 mb-md-4">
          {/* Display the leaderboard information. */}
          <ul className="leaderboard-list left mb-0 mb-md-3">
            {leftColumn.map((user, index) => (
              <li key={index} className="leaderboard-entry">
                <span className="rank">{index + 1}</span>

                <span className="username">
                  <NavLink to={`/profile/${user.username}`}>
                    {user.username}{" "}
                  </NavLink>
                </span>

                {/* Display correct information based on activetab. */}
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
                <span className="username">
                  <NavLink to={`/profile/${user.username}`}>
                    {user.username}
                  </NavLink>
                </span>
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
      <div className="catch-more mt-lg-5">Catch more animals!</div>
    </div>
  );
}
