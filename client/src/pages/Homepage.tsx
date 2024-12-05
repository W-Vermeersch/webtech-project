import Leaderboard from "../components/leaderboard/Leaderboard.tsx";
import "./Homepage.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { Button } from "react-bootstrap";

export default function Homepage() {
  const isAuthenticated = useIsAuthenticated();
  const authUser = useAuthUser();
  const authHeader = useAuthHeader();

  // pretend this data is coming from the backend
  const mockUsers = [
    { name: "Alice", points: 120 },
    { name: "Bob", points: 430 },
    { name: "Charlie", points: 2 },
    { name: "Diana", points: 72 },
    { name: "Eve", points: 80 },
  ];

  return (
    <Container>
      <Button
        variant="primary"
        onClick={() => console.log(isAuthenticated, authHeader, authUser)}
      >
        Log auth
      </Button>
      <Row className={"justify-content-end"}>
        {/* for future components like map and postfeed */}
        <Col xs={9}>test</Col>
        <Col xs={3}>
          <Leaderboard users={mockUsers} />
        </Col>
      </Row>
    </Container>
  );
}
