import Leaderboard from "../components/leaderboard/Leaderboard.tsx";
import "./Homepage.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FeedPage from "../components/scrollerPagination/feedPage.tsx";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Homepage() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    Cookies.remove("shown_post_ids"); // Verwijdert cookie client-side
  }, []);
  return (
    <Container>
      <Row className="title-row justify-content-center">
        <Col xs='auto'>
          <Button
            variant="danger"
            onClick={() => setActiveTab(0)}
            className={`tab-button ${activeTab === 0 ? "active" : ""}`}
          >
            For you
          </Button>
        </Col>
        <Col xs='auto'>
          <Button
            variant="danger"
            onClick={() => {
              setActiveTab(1);
              console.log("Active tab set to: ", 1);
            }}
            className={`tab-button ${activeTab === 1 ? "active" : ""}`}
          >
            Following
          </Button>
        </Col>
      </Row>
      <Row className="feed-container" xs={1} md={2} xl={3}>
        <FeedPage activeTab={activeTab} />
      </Row>
    </Container>
  );
}
