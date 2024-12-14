import Leaderboard from "../components/leaderboard/Leaderboard.tsx";
import "./Homepage.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FeedPage from "../components/scrollerPagination/feedPage.tsx";
import { Button } from "react-bootstrap";

export default function Homepage() {
  return (
    <Container>
      <Col xs={12} md={8} className="mx-auto">
        {/* <Row md={3}>  --> show multiple posts per line */}
          <FeedPage />
       {/*  </Row> */}
      </Col>
    </Container>
  );
}
