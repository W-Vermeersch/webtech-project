import Leaderboard from "../components/leaderboard/Leaderboard.tsx";
import "./Homepage.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FeedPage from "../components/scrollerPagination/feedPage.tsx";
import { Button, ButtonGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Homepage() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    Cookies.remove("shown_post_ids"); // Verwijdert cookie client-side
  }, [activeTab]);

  return (
    <Container>
      <Row className="title-row justify-content-center">
        <ButtonGroup>
          <Button
            variant="danger"
            onClick={() => {
              setActiveTab(0);
              Cookies.remove("shown_post_ids");
            }}
            className={`tab-button ${activeTab === 0 ? "active" : ""}`}
          >
            For you
          </Button>

          <Button
            variant="danger"
            onClick={() => {
              setActiveTab(1);
              Cookies.remove("shown_post_ids");
            }}
            className={`tab-button ${activeTab === 1 ? "active" : ""}`}
          >
            Following
          </Button>
        </ButtonGroup>
      </Row>
      <Row className="feed-container" xs={1} md={2} xl={3}>
        <FeedPage activeTab={activeTab} />
      </Row>
    </Container>
  );
}
